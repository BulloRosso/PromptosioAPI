// src/prompts/dto/create-prompt.dto.ts
import { IsString, IsArray, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DynamicTag, Condition, Example, Memory, PromptMetadata, LLMConfig } from '../../types';

export class CreatePromptDto {
  @ApiProperty({ description: 'Prompt name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Prompt version' })
  @IsString()
  version: string;

  @ApiProperty({ description: 'Prompt content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Static tags' })
  @IsArray()
  @IsString({ each: true })
  staticTags: string[];

  @ApiProperty({ description: 'Dynamic tags' })
  @IsArray()
  @IsObject({ each: true })
  dynamicTags: DynamicTag[];

  @ApiProperty({ description: 'Conditions' })
  @IsArray()
  @IsObject({ each: true })
  conditions: Condition[];

  @ApiProperty({ description: 'Supported languages' })
  @IsArray()
  @IsString({ each: true })
  supportedLanguages: string[];

  @ApiProperty({ description: 'Examples', required: false })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  examples?: Example[];

  @ApiProperty({ description: 'Parent prompt ID', required: false })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiProperty({ description: 'Memory configuration', required: false })
  @IsOptional()
  @IsObject()
  memory?: Memory;

  @ApiProperty({ description: 'Prompt metadata' })
  @IsObject()
  metadata: PromptMetadata;

  @ApiProperty({ description: 'LLM configuration' })
  @IsObject()
  config: LLMConfig;
}