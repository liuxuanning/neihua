import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusController } from './focus.controller';
import { FocusService } from './focus.service';
import { FocusSession } from './focus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FocusSession])],
  controllers: [FocusController],
  providers: [FocusService],
  exports: [FocusService],
})
export class FocusModule {}
