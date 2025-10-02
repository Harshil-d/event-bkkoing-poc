import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { EventEntity } from '../database/entities/event.entity';
import { BookingEntity, BookingStatus } from '../database/entities/booking.entity';
import { UserEntity } from '../database/entities/user.entity';
import { NotificationEntity } from '../database/entities/notification.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /**
   * Builds the high-level metrics tailored for administrators, including event and booking oversight.
   */
  async getAdminSummary(): Promise<DashboardSummaryDto> {
    const [totalEvents, totalBookings, activeUsers] = await Promise.all([
      this.eventRepository.count(),
      this.bookingRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
    ]);

    const notices: string[] = [];

    if (totalEvents === 0) {
      notices.push('No events published yet. Create your first event to get started.');
    }

    if (totalBookings === 0) {
      notices.push('Bookings will appear once attendees reserve seats.');
    }

    const payload = {
      heading: 'Admin Dashboard',
      metrics: {
        totalEvents,
        totalBookings,
        activeUsers,
      },
      notices,
    };

    return plainToInstance(DashboardSummaryDto, payload);
  }

  /**
   * Constructs the per-user dashboard payload focusing on upcoming bookings and notifications.
   */
  async getUserSummary(userId: string): Promise<DashboardSummaryDto> {
    const now = new Date();

    const [upcomingBookings, notificationsUnread] = await Promise.all([
      this.bookingRepository
        .createQueryBuilder('booking')
        .innerJoin('booking.event', 'event')
        .where('booking.userId = :userId', { userId })
        .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
        .andWhere('event.eventDate >= :now', { now })
        .getCount(),
      this.notificationRepository.count({ where: { userId, isRead: false } }),
    ]);

    const notices: string[] = [];

    if (upcomingBookings === 0) {
      notices.push('You have no upcoming bookings. Explore events to reserve your spot.');
    }

    if (notificationsUnread > 0) {
      notices.push('You have unread notifications awaiting your attention.');
    }

    const payload = {
      heading: 'User Dashboard',
      metrics: {
        upcomingBookings,
        notificationsUnread,
      },
      notices,
    };

    return plainToInstance(DashboardSummaryDto, payload);
  }
}
