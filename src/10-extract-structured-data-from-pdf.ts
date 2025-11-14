import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateObject, type LanguageModel } from "ai";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { z } from "zod";

dotenv.config({ path: "../.env" });

const googleModel = google("gemini-2.5-flash");
const anthropicModel = anthropic("claude-haiku-4-5");
const openAIModel = openai("gpt-5");

const schema = z
  .object({
    total: z.number().describe("The total amount of the invoice."),
    currency: z.string().describe("The currency of the total amount."),
    subtotal: z.number().describe("The subtotal of the invoice."),
    VAT: z.number().describe("The VAT of the invoice."),
    VATRate: z
      .string()
      .describe("The VAT expressed in percentage followed by percentage sign."),
    companyName: z
      .string()
      .describe("The name of the company issuing the invoice."),
    companyAddress: z
      .string()
      .describe("The address of the company or person issuing the invoice."),
    purchaseDate: z
      .string()
      .describe("The date the items from the invoice were purchased."),
    invoiceNumber: z.string().describe("The invoice number."),
    paymentTerms: z.string().describe("The terms for payment."),
    soldTo: z.string().describe("The person of compny receiving the invoice."),
    purchases: z.array(
      z.object({
        description: z.string().describe("The title of the item purchased."),
        url: z.string().describe("The URL of the item purchased."),
        unitPrice: z.number().describe("The unit price of the item purchased."),
        copies: z
          .number()
          .describe("The number of copies of the item purchased."),
        itemTotal: z
          .number()
          .describe("The total amount for the item purchased."),
      })
    ),
    incorporationNumber: z
      .string()
      .describe("The incorporation number of the company."),
    EUVATNumber: z.string().describe("The EU VAT number of the company."),
  })
  .describe("The extracted data from the invoice.");

async function exportStructuredData(invoicePath: string, model: LanguageModel) {
  const { object } = await generateObject({
    model,
    system:
      `You will receive an invoice. ` +
      `Please extract the data from the invoice.`,
    schema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: readFileSync(invoicePath),
            mediaType: "application/pdf",
          },
        ],
      },
    ],
  });

  return object;
}

const result = await exportStructuredData("../assets/invoice.pdf", openAIModel);

console.dir(result, { depth: null });
