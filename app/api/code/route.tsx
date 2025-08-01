import { checkApiLimit, increaseApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI({
  apiKey: process.env.GITHUB_TOKEN,
  baseURL: "https://models.github.ai/inference"
});

const instructionMessage: ChatCompletionMessageParam = {
  role: 'assistant',
  content: 'You are a code generator. You must answer only in markdown code snippets. Use code comments and text for explanations.'
}

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

    if (!freeTrial) return NextResponse.json(
      { error: 'Free trial has expired.' },
      { status: 403 }
    )

    const res = await openai.chat.completions.create({
      model: 'openai/gpt-4.1', 
      messages: [instructionMessage, ...messages]
    });

    await increaseApiLimit();

    return NextResponse.json(res.choices[0].message);
  } catch (error: any) {
    // TODO: Open Pro Modal
    console.error('[CODE_ERROR]', error);
    return NextResponse.json(
      { error: 'Initial Server Error' }, 
      { status: 500 }
    )
  }
}