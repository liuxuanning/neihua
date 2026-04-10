import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FocusService } from './focus.service';
import { StartFocusDto, EndFocusDto } from './dto/focus.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('focus')
@UseGuards(JwtAuthGuard)
export class FocusController {
  constructor(private readonly focusService: FocusService) {}

  @Post('start')
  async startSession(@Body() startDto: StartFocusDto, @Request() req: any) {
    return this.focusService.startSession(req.user.id, startDto);
  }

  @Put(':id/end')
  async endSession(
    @Param('id') id: string,
    @Body() endDto: EndFocusDto,
    @Request() req: any,
  ) {
    return this.focusService.endSession(id, req.user.id, endDto);
  }

  @Get('current')
  async getCurrentSession(@Request() req: any) {
    return this.focusService.getCurrentSession(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.focusService.getStats(req.user.id);
  }

  @Get('history')
  async getHistory(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Request() req: any,
  ) {
    return this.focusService.getHistory(req.user.id, page || 1, limit || 20);
  }

  @Get('streak')
  async getStreak(@Request() req: any) {
    return this.focusService.getStreak(req.user.id);
  }
}
