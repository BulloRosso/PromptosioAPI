// src/prompts/prompts.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { 
  Prompt, 
  PromptExecutionResult, 
  PromptExecutionContext,
  Condition 
} from '../types/prompt.types';
import { CreatePromptDto, UpdatePromptDto } from './dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PromptsService {
  constructor(private readonly storageService: StorageService) {}

  async getAllPrompts(tags?: string[], searchTerm?: string): Promise<Prompt[]> {
    let prompts = await this.storageService.listPrompts();

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      prompts = prompts.filter(prompt => 
        tags.every(tag => prompt.staticTags.includes(tag))
      );
    }

    // Filter by search term if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      prompts = prompts.filter(prompt => 
        prompt.name.toLowerCase().includes(term) ||
        prompt.content.toLowerCase().includes(term) ||
        prompt.staticTags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return prompts;
  }
  
  async createPrompt(createDto: CreatePromptDto): Promise<Prompt> {
    const prompt: Prompt = {
      ...createDto,
      id: createDto.name.toLowerCase().replace(/\s+/g, '-'),
      metadata: {
        ...createDto.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    await this.storageService.savePrompt(prompt);
    return prompt;
  }

  async getPrompt(id: string, version: string): Promise<Prompt> {
    return this.storageService.getPrompt(id, version);
  }

  async updatePrompt(
    id: string, 
    version: string, 
    updateDto: UpdatePromptDto
  ): Promise<Prompt> {
    const existingPrompt = await this.getPrompt(id, version);

    const updatedPrompt: Prompt = {
      ...existingPrompt,
      ...updateDto,
      metadata: {
        ...existingPrompt.metadata,
        ...updateDto.metadata,
        updatedAt: new Date().toISOString()
      }
    };

    await this.storageService.savePrompt(updatedPrompt);
    return updatedPrompt;
  }

  async deletePrompt(id: string, version: string): Promise<void> {
    await this.storageService.deletePrompt(id, version);
  }

  async executePrompt(
    promptId: string,
    version: string,
    variables: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<PromptExecutionResult> {
    const prompt = await this.getPrompt(promptId, version);

    // Here you would integrate with the LLM service
    // For now, return a mock result
    return {
      promptId,
      version,
      input: variables,
      output: "Example output",
      timestamp: new Date().toISOString(),
      metrics: {
        tokensUsed: 0,
        executionTimeMs: 0
      },
      metadata
    };
  }

  async getPromptVersions(id: string): Promise<string[]> {
    return this.storageService.getPromptVersions(id);
  }
}