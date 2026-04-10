import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { SubmitReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('review')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('today')
  async getTodayReviews(@Request() req: any) {
    return this.reviewService.getTodayReviews(req.user.id);
  }

  @Get('calendar')
  async getReviewCalendar(
    @Query('days') days: number,
    @Request() req: any,
  ) {
    return this.reviewService.getReviewCalendar(req.user.id, days || 30);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.reviewService.getStats(req.user.id);
  }

  @Post('submit')
  async submitReview(@Body() submitDto: SubmitReviewDto, @Request() req: any) {
    return this.reviewService.submitReview(req.user.id, submitDto);
  }

  @Get('history')
  async getHistory(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Request() req: any,
  ) {
    return this.reviewService.getHistory(req.user.id, page || 1, limit || 20);
  }
}
