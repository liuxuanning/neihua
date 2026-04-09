import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto, UpdateKnowledgeDto, KnowledgeQueryDto, ImportFromUrlDto } from './dto/knowledge.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('knowledge')
@UseGuards(JwtAuthGuard)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  async create(@Body() createDto: CreateKnowledgeDto, @Request() req) {
    return this.knowledgeService.create(req.user.id, createDto);
  }

  @Get()
  async findAll(@Query() query: KnowledgeQueryDto, @Request() req) {
    return this.knowledgeService.findAll(req.user.id, query);
  }

  @Get('today')
  async getTodayKnowledge(@Request() req) {
    return this.knowledgeService.getTodayKnowledge(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.knowledgeService.getStats(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.knowledgeService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateKnowledgeDto,
    @Request() req,
  ) {
    return this.knowledgeService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.knowledgeService.remove(id, req.user.id);
  }

  @Post('import')
  async importFromUrl(@Body() importDto: ImportFromUrlDto, @Request() req) {
    return this.knowledgeService.importFromUrl(req.user.id, importDto);
  }

  @Get(':id/mindmap')
  async getMindmap(@Param('id') id: string, @Request() req) {
    return this.knowledgeService.getMindmap(id, req.user.id);
  }
}
