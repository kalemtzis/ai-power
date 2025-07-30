import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
})

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { prompt } = await req.json();

    if (!userId) return NextResponse.json(
      { error: "Unautherized" }, 
      { status: 401 }
    );

    if (!prompt) return NextResponse.json(
      { error: "Prompt is required" }, 
      { status: 400 }
    );

    const res = await replicate.run()

  } catch (error: any) {
    // TODO: Open Pro Modal
    console.error('[CONVERSATION_ERROR]', error);
    return NextResponse.json(
      { error: 'Initial Server Error' }, 
      { status: 500 }
    )
  }
}