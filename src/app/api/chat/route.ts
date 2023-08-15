import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const config = new Configuration({
  apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request) {
  const { uuid, messages } = await req.json();

  // Check last Paid
  try {
    const lastTimestamp = (await kv.get(uuid)) as number;

    if (!lastTimestamp) {
      throw new Error("No timestamp found");
    } else {
      const now = Date.now();
      if (now - lastTimestamp > Number(process.env.NEXT_PUBLIC_SESSION_TIME)) {
        throw new Error("Session timed out, please pay more");
      }
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: `${e}` });
  }

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    messages,
  });
  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
