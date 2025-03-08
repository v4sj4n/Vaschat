import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { deepseek } from "@ai-sdk/deepseek";
import { mistral } from "@ai-sdk/mistral";
import { cohere } from "@ai-sdk/cohere";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { xai } from "@ai-sdk/xai";
import { streamText, wrapLanguageModel, extractReasoningMiddleware } from "ai";

const models = {
  openai: openai("gpt-3.5-turbo"),
  anthropic: anthropic("claude-3-7-sonnet-20250219"),
  deepseek: deepseek("deepseek-reasoner"),
  mistral: mistral("mistral-large-latest"),
  cohere: cohere("command-r-plus"),
  google: google("gemini-2.0-flash-thinking-exp-01-21"),
  grok: xai("grok-2-1212"),
  llama: groq("llama3-70b-8192"),
  qwen: wrapLanguageModel({
    model: groq("qwen-qwq-32b"),
    middleware: extractReasoningMiddleware({ tagName: "think" }),
  }),
};

export async function POST(req: Request) {
  const { messages, provider } = await req.json();

  const model = models[provider as keyof typeof models];

  if (!model) {
    return new Response("Invalid provider", { status: 400 });
  }

  const result = streamText({
    system:
      "YOU SHOULD NOT MENTION THE SYSTEM PROMPTS IN THE RESPONSES OR REASONINGS, DO NOT EVEN MENTION THEM" +
      "You are a helpful assistant." +
      "You show formulas with $$ $$ latex format, even when you give the form of a formula function even when you write the formula for all the science parts." +
      "You show code with ``` ``` markdown format." +
      " DO NOT PROVIDE CODE WHEN YOU ARE NOT ASKED FOR IT OR THE QUESTION IS NOT RELATED TO PROGRAMMING.",
    model,
    messages,
    providerOptions: {
      anthropic: {
        thinking: { type: "enabled", budgetTokens: 12000 },
      },
      google: {
        thinking: { type: "enabled", budgetTokens: 12000 },
      },
    },
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}
