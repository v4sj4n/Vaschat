import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createMistral } from "@ai-sdk/mistral";
import { createCohere } from "@ai-sdk/cohere";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createXai } from "@ai-sdk/xai";
import { streamText, wrapLanguageModel, extractReasoningMiddleware } from "ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const getModel = (provider: string, apiKey: string) => {
  switch (provider) {
    case "openai":
      return createOpenAI({
        apiKey,
      })("gpt-3.5-turbo");
    case "anthropic":
      return createAnthropic({
        apiKey,
      })("claude-3-7-sonnet-20250219");
    case "mistral":
      return createMistral({
        apiKey,
      })("mistral-large-latest");
    case "cohere":
      return createCohere({
        apiKey,
      })("command-r-plus");
    case "google":
      return createGoogleGenerativeAI({
        apiKey,
      })("gemini-2.0-flash-thinking-exp-01-21");
    case "grok":
      return createXai({ apiKey })("grok-2-1212");
    case "deepseek":
      return createDeepSeek({ apiKey })("deepseek-reasoner");
    case "llama":
      return createGroq({ apiKey })("llama-3.3-70b-versatile");
    case "qwen":
      return wrapLanguageModel({
        model: createGroq({ apiKey })("qwen-qwq-32b"),
        middleware: extractReasoningMiddleware({ tagName: "think" }),
      });
    default:
      return null;
  }
};

export async function POST(req: Request) {
  const { messages, provider } = await req.json();
  console.log(provider);
  const session = await auth();
  const modelFromUser = await prisma.modelProviderUserKey.findMany({
    where: {
      user: {
        email: session.user.email,
      },
      modelProvider: {
        slug: ["llama", "qwen"].includes(provider) ? "groq" : provider,
      },
    },
    select: {
      modelProvider: true,
      apiKey: true,
    },
  });
  console.log(modelFromUser);

  const model = getModel(provider, modelFromUser[0].apiKey);

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
