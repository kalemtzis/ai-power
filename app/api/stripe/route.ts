import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const settingsUrl = absoluteUrl('/settings');

export const GET = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if(!userId || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId: userId
      }
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: {
              name: "aiPowerPro",
              description: "Unlimited AI Generations",
            },
            unit_amount: 1000,
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        userId
      }
    })

    return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}