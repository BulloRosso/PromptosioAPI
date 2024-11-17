// src/llm/token.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TokenCountService {
  private readonly logger = new Logger(TokenCountService.name);

  countTokens(text: string, model: string): number {
    // Basic implementation
    return Math.ceil(text.length / 4);
  }

  async getTokenUsage(model: string, prompt: string, completion: string): Promise<{
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  }> {
    const promptTokens = this.countTokens(prompt, model);
    const completionTokens = this.countTokens(completion, model);

    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens
    };
  }
}