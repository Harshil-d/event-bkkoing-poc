import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../common/guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../database/entities/event.entity';
import { BookingEntity } from '../database/entities/booking.entity';
import { UserEntity } from '../database/entities/user.entity';
import { NotificationEntity } from '../database/entities/notification.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([EventEntity, BookingEntity, UserEntity, NotificationEntity]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, RolesGuard],
})
export class DashboardModule {}
