import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventEntity } from '../database/entities/event.entity';
import { BookingEntity } from '../database/entities/booking.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, BookingEntity]),
    AuthModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, JwtAuthGuard, RolesGuard],
  exports: [EventsService],
})
export class EventsModule {}
