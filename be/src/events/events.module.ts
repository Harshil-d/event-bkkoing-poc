import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventEntity } from '../database/entities/event.entity';
import { BookingEntity } from '../database/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, BookingEntity])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
