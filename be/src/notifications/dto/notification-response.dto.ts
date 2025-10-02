import { Expose, Type } from 'class-transformer';

/**
 * Representation of notification resources returned to clients.
 */
export class NotificationResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  message: string;

  @Expose()
  isRead: boolean;

  @Expose()
  redirectionUrl?: string | null;

  @Expose()
  @Type(() => Date)
  createdAt: Date;
}

/**
 * Pagination metadata for notification listings.
 */
export class NotificationPaginationMetaDto {
  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  totalItems: number;

  @Expose()
  totalPages: number;
}

/**
 * Wrapper for delivering paginated notifications.
 */
export class PaginatedNotificationResponseDto {
  @Expose()
  @Type(() => NotificationResponseDto)
  items: NotificationResponseDto[];

  @Expose()
  @Type(() => NotificationPaginationMetaDto)
  meta: NotificationPaginationMetaDto;
}
