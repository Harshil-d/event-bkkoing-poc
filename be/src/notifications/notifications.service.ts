import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { NotificationEntity } from '../database/entities/notification.entity';
import {
  NotificationResponseDto,
  PaginatedNotificationResponseDto,
  NotificationPaginationMetaDto,
} from './dto/notification-response.dto';
import { ListNotificationsDto } from './dto/list-notifications.dto';

interface BookingNotificationPayload {
  userId: string;
  eventTitle: string;
  eventId: string;
  seats: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  /**
   * Persists a notification record using the provided manager or falls back to the default repository.
   */
  private async saveNotification(
    notification: NotificationEntity,
    manager?: EntityManager,
  ): Promise<NotificationEntity> {
    const repo = manager
      ? manager.getRepository(NotificationEntity)
      : this.notificationRepository;
    return repo.save(notification);
  }

  /**
   * Creates a booking confirmation notification that can be invoked within transactions.
   */
  async createBookingConfirmationNotification(
    payload: BookingNotificationPayload,
    manager?: EntityManager,
  ): Promise<void> {
    const notification = this.notificationRepository.create({
      userId: payload.userId,
      message: `Successfully booked ${payload.seats} seat(s) for ${payload.eventTitle}.`,
      redirectionUrl: `/events/${payload.eventId}`,
    });

    await this.saveNotification(notification, manager);
  }

  /**
   * Retrieves notifications for a user with support for pagination and unread filtering.
   */
  async listUserNotifications(
    userId: string,
    query: ListNotificationsDto,
  ): Promise<PaginatedNotificationResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (query.unreadOnly) {
      qb.andWhere('notification.isRead = :isRead', { isRead: false });
    }

    const [items, totalItems] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = plainToInstance(NotificationPaginationMetaDto, {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    });

    return plainToInstance(PaginatedNotificationResponseDto, {
      items: plainToInstance(NotificationResponseDto, items, {
        excludeExtraneousValues: true,
      }),
      meta,
    });
  }

  /**
   * Marks a notification as read for the requesting user and returns the updated resource.
   */
  async markNotificationAsRead(
    notificationId: string,
    userId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (!notification.isRead) {
      notification.isRead = true;
      await this.notificationRepository.save(notification);
    }

    return plainToInstance(NotificationResponseDto, notification, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Counts unread notifications for quick dashboard summaries.
   */
  async countUnreadNotifications(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }
}
