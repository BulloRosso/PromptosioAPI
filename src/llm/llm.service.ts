// src/llm/llm.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import {
  ChatPromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { RunnableSequence } from '@langchain/core/runnables';
import { LLMConfig, LLMResponse, TokenUsage } from '../types/llm.types';

// Simple token counting implementation without external dependencies
@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private llmInstances: Map<string, BaseLanguageModel> = new Map();

  constructor(private configService: ConfigService) {}

  private getInstanceKey(config: LLMConfig): string {
    return `${config.provider}-${config.model}-${config.temperature}`;
  }

  private countTokens(text: string): number {
    // Simple estimation - in production you'd want to use a proper tokenizer
    return Math.ceil(text.length / 4);
  }

  private async createLLMInstance(config: LLMConfig): Promise<BaseLanguageModel> {
    try {
      const baseConfig = {
        modelName: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      };

      switch (config.provider) {
        case 'openai':
          return new ChatOpenAI({
            ...baseConfig,
            openAIApiKey: config.apiKey || this.configService.get('OPENAI_API_KEY'),
          });

        case 'anthropic':
          return new ChatAnthropic({
            ...baseConfig,
            anthropicApiKey: config.apiKey || this.configService.get('ANTHROPIC_API_KEY'),
          });

        default:
          throw new Error(`Unsupported LLM provider: ${config.provider}`);
      }
    } catch (error) {
      this.logger.error(`Failed to create LLM instance: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async getLLMInstance(config: LLMConfig): Promise<BaseLanguageModel> {
    const instanceKey = this.getInstanceKey(config);

    if (!this.llmInstances.has(instanceKey)) {
      const instance = await this.createLLMInstance(config);
      this.llmInstances.set(instanceKey, instance);
    }
    return this.llmInstances.get(instanceKey)!;
  }

  async generateResponse(
    content: string,
    variables: Record<string, any>,
    config: LLMConfig
  ): Promise<LLMResponse> {
    try {
      const llm = await this.getLLMInstance(config);
      const prompt = PromptTemplate.fromTemplate(content);

      const chain = RunnableSequence.from([
        prompt,
        llm
      ]);

      const formattedPrompt = await prompt.format(variables);
      const promptTokens = this.countTokens(formattedPrompt);

      const response = await chain.invoke(variables);
      const responseText = response.toString();
      const completionTokens = this.countTokens(responseText);

      return {
        text: responseText,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens
        }
      };

    } catch (error) {
      this.logger.error('Generation failed:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async generateBatch(
    content: string,
    variablesBatch: Record<string, any>[],
    config: LLMConfig
  ): Promise<LLMResponse[]> {
    const llm = await this.getLLMInstance(config);
    const prompt = PromptTemplate.fromTemplate(content);
    const chain = RunnableSequence.from([prompt, llm]);

    const results = await chain.batch(variablesBatch);

    return Promise.all(results.map(async (result, index) => {
      const responseText = result.toString();
      const formattedPrompt = await prompt.format(variablesBatch[index]);
      return {
        text: responseText,
        usage: {
          promptTokens: this.countTokens(formattedPrompt),
          completionTokens: this.countTokens(responseText),
          totalTokens: this.countTokens(formattedPrompt + responseText)
        }
      };
    }));
  }

  async resetInstance(config: LLMConfig): Promise<void> {
    const instanceKey = this.getInstanceKey(config);
    this.llmInstances.delete(instanceKey);
  }
}