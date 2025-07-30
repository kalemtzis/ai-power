import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/*
const instructionMessage: ChatCompletionMessageParam = {
  role: 'system',
  content: `
    You are an expert painter who generates beautiful pictures throw a text description.
    You answer with an image url for purpose of using to src attribute of Image components.
  `
}
*/

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { prompt, amount = "1", resolution = "512x512" } = await req.json();

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

    if (!resolution) return NextResponse.json(
      { error: "Aspect ratio required" }, 
      { status: 400 }
    );
  
    const res = await fetch('https://api.edenai.run/v2/image/generation/', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.EDENAI_API_TOKEN}`
        //authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWJmMTI5MzUtZjc2Yy00MTVhLTgzNTQtNmQ5Zjk0NmMzYmU3IiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.vwqM5KFFFBaezbAGNqKvh8ZGTeaC2IZnHTxrRJYRzCg'
      },
      body: JSON.stringify({
        response_as_dict: false,
        num_images: parseInt(amount),
        providers: ['stabilityai'],
        text: prompt,
        resolution: resolution
      })
    })

    const json = await res.json()
  
    return NextResponse.json(json);

  } catch (error: any) {
    // TODO: Open Pro Modal
    console.error('[IMAGE_ERROR]', error);
    return NextResponse.json(
      { error: 'Initial Server Error' }, 
      { status: 500 }
    )
  }
}