// src/prompts/dto/execute-prompt.dto.ts
import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecutePromptDto {
  @ApiProperty({ description: 'Prompt ID' })
  @IsString()
  promptId: string;

  @ApiProperty({ description: 'Prompt version' })
  @IsString()
  version: string;

  @ApiProperty({ description: 'Variables for prompt execution' })
  @IsObject()
  variables: Record<string, any>;

  @ApiProperty({ description: 'Optional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}