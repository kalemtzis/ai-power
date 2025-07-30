import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { prompt, amount = "1", aspect_ratio = "4:3" } = await req.json();

    if (!userId) return NextResponse.json(
      { error: "Unautherized" }, 
      { status: 401 }
    );

    if (!prompt) return NextResponse.json(
      { error: "Prompt required" }, 
      { status: 400 }
    );

    if (!amount) return NextResponse.json(
      { error: "Amount required" }, 
      { status: 400 }
    );

    if (!aspect_ratio) return NextResponse.json(
      { error: "Aspect ratio required" }, 
      { status: 400 }
    );
/*
    const res = await openai.images.generate({
      model: 'deepseek/deepseek-r1:free',
      prompt: prompt,
      n: parseInt(amount),
      size: resolution
    })
*/
    const input = {
      prompt: prompt,
      aspect_ratio: aspect_ratio
    }
    const res = await replicate.run('google/imagen-4', { input });
      
    return NextResponse.json(res);

  } catch (error: any) {
    // TODO: Open Pro Modal
    console.error('[IMAGE_ERROR]', error);
    return NextResponse.json(
      { error: 'Initial Server Error' }, 
      { status: 500 }
    )
  }
}