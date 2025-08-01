import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { increaseApiLimit, checkApiLimit } from '@/lib/apiLimit';

const openai = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN,
  baseURL: "https://models.github.ai/inference"
})

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { messages } = await req.json();

    if (!userId) return NextResponse.json(
      { error: "Unautherized" }, 
      { status: 401 }
    );

    if (!messages) return NextResponse.json(
      { error: "Prompt required" }, 
      { status: 400 }
    );

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return NextResponse.json({ error: "Free Trial has expired." }, { status: 403 })
    }

    const res = await openai.chat.completions.create({
      model: 'openai/gpt-4.1',
      messages: messages,
      temperature: 0.7,
    });

    await increaseApiLimit();

    return NextResponse.json(res.choices[0].message)

  } catch (error: any) {
    // TODO: Open Pro Modal
    console.error('[CONVERSATION_ERROR]', error);
    return NextResponse.json(
      { error: 'Initial Server Error' }, 
      { status: 500 }
    )
  }
}