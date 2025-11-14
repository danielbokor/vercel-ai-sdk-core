import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateObject, type LanguageModel } from "ai";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../.env", quiet: true });

const googleModel = google("gemini-2.5-flash");
const anthropicModel = anthropic("claude-sonnet-4-5");
const openAIModel = openai("gpt-5");

const schema = z.object({
  name: z.string().describe("The name of the person."),
  email: z.string().describe("The email of the person."),
  title: z.string().describe("The job title of the person."),
  company: z.string().describe("The company the person works for."),
});

async function generateArray(prompt: string, model: LanguageModel) {
  const { object } = await generateObject({
    model,
    output: "array",
    schema,
    schemaName: "Person",
    prompt,
    system: `You are generting fake data.`,
  });

  return object;
}

const fakeData = await generateArray(
  `Generate 5 users from IT companies that have offices in Cluj-Napoca.`,
  googleModel
);

console.dir(fakeData, { depth: null });
