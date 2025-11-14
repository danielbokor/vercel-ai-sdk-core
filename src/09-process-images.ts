import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateText, type LanguageModel } from "ai";
import dotenv from "dotenv";
import { readFile } from "fs/promises";
dotenv.config({ path: "../.env" });

const googleModel = google("gemini-2.5-flash");
const anthropicModel = anthropic("claude-haiku-4-5");
const openAIModel = openai("gpt-5");

const systemPrompt =
  `You will receive an image. ` +
  `Please create an alt text for the image. ` +
  `Be concise. ` +
  `Use adjectives only when necessary. ` +
  `Do not pass 160 characters. ` +
  `Use simple language. `;

async function describeImage(imagePath: string, model: LanguageModel) {
  const imageAsUint8Array = await readFile(imagePath);

  const { text } = await generateText({
    model,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: imageAsUint8Array,
          },
        ],
      },
    ],
  });

  return text;
}

const description = await describeImage("../assets/1.jpg", anthropicModel);

console.log("\n\n", description);
