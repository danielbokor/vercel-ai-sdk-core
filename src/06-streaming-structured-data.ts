import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { streamObject, type LanguageModel } from "ai";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../.env", quiet: true });

const googleModel = google("gemini-2.5-flash");
const anthropicModel = anthropic("claude-sonnet-4-5");
const openAIModel = openai("gpt-5");

const recipeSchema = z.object({
  name: z.string().describe("The name of the recipe."),
  ingredients: z
    .array(
      z.object({
        name: z.string().describe("The name of the ingredient."),
        amount: z.string().describe("The amount of the ingredient."),
      })
    )
    .describe("The ingredients needed for the recipe."),
  steps: z.array(z.string()).describe("The steps to make the recipe."),
});

async function createRecipe(
  prompt: string,
  model: LanguageModel,
  language: "Romanian" | "English" = "English"
) {
  const result = streamObject({
    model,
    prompt,
    schema: recipeSchema,
    schemaName: "Recipe",
    system:
      `You are helping a user create a recipe. ` +
      `Generate structured data based on the prompt. ` +
      `The data should be in the following schema: ${recipeSchema.describe}. ` +
      `Use the following language: ${language}. `,
  });

  for await (const obj of result.partialObjectStream) {
    console.clear();
    console.dir(obj, { depth: null });
  }

  const finalObject = await result.object;

  return finalObject;
}

const recipe = await createRecipe(
  "I need an idea for a dinner recipe.",
  openAIModel,
  "Romanian"
);

console.log("\n\nrecipe:", recipe);
