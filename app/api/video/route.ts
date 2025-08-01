import { checkApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    const { prompt } = await req.json();
    
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    const freeTrial = await checkApiLimit();

    if (!freeTrial) return NextResponse.json(
      { error: 'Free trial has expired' },
      { status: 403 }
    )
/*
    const res = await replicate.run('', {
      input: {
        prompt
      }
    })

    await increaseApiLimit();

    return NextResponse.json(res);
*/
  } catch (error: unknown) {
    console.error("[VIDEO_ERROR]", error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}