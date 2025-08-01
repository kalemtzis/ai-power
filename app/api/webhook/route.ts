import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  const body = await req.text();
  const signature = (await headers()).get('Stripe-Signature') as string;
  
  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown Webhook error"
    return new NextResponse(`Webook Error: ${errorMessage}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    if (!session?.metadata?.userId) {
      return new NextResponse('User id is required', { status: 400 });
    }

    await prismadb.userSubscription.create({
      data: {
        userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000)
      }
    })
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await prismadb.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000)
      }
    })
  }

  return new NextResponse(null, { status: 200 })
}