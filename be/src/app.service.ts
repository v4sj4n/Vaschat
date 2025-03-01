import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { Response } from 'express';
import { LanguageModelV1, pipeDataStreamToResponse, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { deepseek } from '@ai-sdk/deepseek';
import { mistral } from '@ai-sdk/mistral';
import { cohere } from '@ai-sdk/cohere';
import { google } from '@ai-sdk/google';
import { xai } from '@ai-sdk/xai';
import { groq } from '@ai-sdk/groq';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getCompletion(chatDto: ChatDto, res: Response) {
    pipeDataStreamToResponse(res, {
      execute: (dataStreamWriter) => {
        dataStreamWriter.writeData('initialized call');

        const result = streamText({
          system:
            'You are a generalist' +
            'If someone asks a question pretend that you are a specialist if you can open their curiousity and act as a professional in the field.' +
            'you answer in markdown' +
            'when talking about the form or the method when you have to write formulas always write them like this $$ x^2 $$.' +
            "When writing code write it like so ```python print('hello world')```",
          model: this.getModel(chatDto.provider),
          messages: chatDto.messages,
          providerOptions: {
            anthropic: {
              thinking: { type: 'enabled', budgetTokens: 12000 },
            },
          },
        });

        result.mergeIntoDataStream(dataStreamWriter, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        return error instanceof Error ? error.message : String(error);
      },
    });
  }

  getModel(provider: string): LanguageModelV1 {
    switch (provider) {
      case 'openai':
        return openai('gpt-4o-mini');
      case 'anthropic':
        return anthropic('claude-3-7-sonnet-20250219');
      case 'deepseek':
        return deepseek('deepseek-reasoner');
      case 'mistral':
        return mistral('mistral-large-latest');
      case 'cohere':
        return cohere('command-r-plus');
      case 'google':
        return google('gemini-2.0-flash-thinking-exp-01-21');
      case 'llama':
        return groq('llama-3.3-70b-versatile');
      case 'qwen':
        return groq('qwen-2.5-32b');
      case 'grok':
        return xai('grok-beta');
      default:
        return openai('gpt-3.5-turbo');
    }
  }
}
