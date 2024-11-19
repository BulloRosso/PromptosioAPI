// src/prompts/prompts.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch,
  Delete, 
  Body, 
  Param,
  Query,
  Logger
} from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto, UpdatePromptDto, ExecutePromptDto } from './dto';
import { Prompt } from '../types/prompt.types';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('prompts')
@Controller('prompts')
export class PromptsController {

  private readonly logger = new Logger(PromptsController.name);
 
  constructor(private readonly promptsService: PromptsService) {}

   @Get(':id/:version/children')
    @ApiOperation({ summary: 'Get all child prompts' })
    @ApiResponse({ status: 200, description: 'Return all child prompts' })
    async getPromptChildren(
      @Param('id') id: string,
      @Param('version') version: string
    ): Promise<Prompt[]> {
      return this.promptsService.getPromptChildren(`${id}_${version}`);
    }

  @Patch(':id/:version')
  async updatePromptParent(
    @Param('id') id: string,
    @Param('version') version: string,
    @Body() updateDto: { parentId: string | null }
  ): Promise<Prompt> {
    try {
      return await this.promptsService.updatePrompt(id, version, updateDto);
    } catch (error: any) {
      this.logger.error(`Error updating prompt parent: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all prompts' })
  @ApiResponse({ status: 200, description: 'Return all prompts' })
  async getPrompts(
    @Query('tags') tags?: string[],
    @Query('searchTerm') searchTerm?: string
  ): Promise<Prompt[]> {
    return this.promptsService.getAllPrompts(tags, searchTerm);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new prompt' })
  @ApiResponse({ status: 201, description: 'Prompt created successfully' })
  async createPrompt(
    @Body() createPromptDto: CreatePromptDto
  ): Promise<Prompt> {
    return this.promptsService.createPrompt(createPromptDto);
  }

  @Get(':id/:version')
  @ApiOperation({ summary: 'Get a specific prompt version' })
  @ApiResponse({ status: 200, description: 'Return the prompt' })
  async getPrompt(
    @Param('id') id: string,
    @Param('version') version: string
  ): Promise<Prompt> {
    return this.promptsService.getPrompt(id, version);
  }

  @Put(':id/:version')
  @ApiOperation({ summary: 'Update a prompt' })
  @ApiResponse({ status: 200, description: 'Prompt updated successfully' })
  async updatePrompt(
    @Param('id') id: string,
    @Param('version') version: string,
    @Body() updatePromptDto: UpdatePromptDto
  ): Promise<Prompt> {
    return this.promptsService.updatePrompt(id, version, updatePromptDto);
  }

  @Delete(':id/:version')
  @ApiOperation({ summary: 'Delete a prompt' })
  @ApiResponse({ status: 200, description: 'Prompt deleted successfully' })
  async deletePrompt(
    @Param('id') id: string,
    @Param('version') version: string
  ): Promise<void> {
    await this.promptsService.deletePrompt(id, version);
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute a prompt' })
  @ApiResponse({ status: 200, description: 'Prompt executed successfully' })
  async executePrompt(
    @Body() executeDto: ExecutePromptDto
  ): Promise<any> {
    return this.promptsService.executePrompt(
      executeDto.promptId,
      executeDto.version,
      executeDto.variables,
      executeDto.metadata
    );
  }
}