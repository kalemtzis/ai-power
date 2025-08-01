import { checkApiLimit, increaseApiLimit } from '@/lib/apiLimit';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
//import Replicate from 'replicate';

/*
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY
  
})
*/

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

    const freeTrial = await checkApiLimit();

    if (!freeTrial) return NextResponse.json(
      { error: 'Free trial expired.' },
      { status: 403 }
    )

    // TODO: Find an API
/*
    const res = await replicate.run('', {
      input: {
        prompt_a: prompt
      }
    })

    await increaseApiLimit();

    return NextResponse.json(res);
*/
  } catch (error: any) {
    // TODO: Open Pro Modal
    console.error('[MUSIC_ERROR]', error);
    return NextResponse.json(
      { error: 'Initial Server Error' }, 
      { status: 500 }
    )
  }
}