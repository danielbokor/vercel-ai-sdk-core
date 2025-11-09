import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env", quiet: true });

const model = google("gemini-2.5-flash");

async function answerMyQuestion(prompt: string) {
  const result = await streamText({
    model,
    prompt,
  });

  for await (const textPart of result.textStream) {
    console.log(textPart);
  }

  return result.textStream;
}

await answerMyQuestion("what is love?");
