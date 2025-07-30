import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
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

    const res = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: messages,
      temperature: 0.7,
    });

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