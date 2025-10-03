import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingEntity } from '../database/entities/booking.entity';
import { EventEntity } from '../database/entities/event.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity, EventEntity]),
    NotificationsModule,
    AuthModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, JwtAuthGuard, RolesGuard],
  exports: [BookingsService],
})
export class BookingsModule {}
