import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateObject, type LanguageModel } from "ai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env", quiet: true });

const googleModel = google("gemini-2.5-flash");
const anthropicModel = anthropic("claude-sonnet-4-5");
const openAIModel = openai("gpt-5");

async function classifySentiment(prompt: string, model: LanguageModel) {
  const { object } = await generateObject({
    model,
    output: "enum",
    enum: ["positive", "negative", "neutral"],
    prompt,
    system:
      `Classify the sentiment of the text as either ` +
      `positive, negative, or neutral.`,
  });

  return object;
}

const statement = "this workshop is booooring.";

const sentiment = await classifySentiment(statement, openAIModel);

console.log({ statement, sentiment });
