import { IsString, IsArray, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DynamicTag, Condition,  Memory, PromptMetadata, LLMConfig } from '../../types';
import { CreatePromptDto } from './create-prompt.dto';

// src/prompts/dto/update-prompt.dto.ts
export class UpdatePromptDto implements Partial<CreatePromptDto> {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  staticTags?: string[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  dynamicTags?: DynamicTag[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  conditions?: Condition[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedLanguages?: string[];

  @IsOptional()
  @IsString()
  parentId?: string | null;  // Allow null for unlinking

  @IsOptional()
  @IsObject()
  metadata?: PromptMetadata;

  @IsOptional()
  @IsObject()
  config?: LLMConfig;
}