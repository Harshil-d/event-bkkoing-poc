import { Expose, Type } from 'class-transformer';

/**
 * Event subset included on booking payloads to aid UI rendering.
 */
export class BookingEventSummaryDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  @Type(() => Date)
  eventDate: Date;
}

/**
 * Response contract for booking resources.
 */
export class BookingResponseDto {
  @Expose()
  id: string;

  @Expose()
  userId: string;

  @Expose()
  eventId: string;

  @Expose()
  seatsBooked: number;

  @Expose()
  status: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => BookingEventSummaryDto)
  event?: BookingEventSummaryDto;
}

/**
 * Pagination metadata for booking listings.
 */
export class BookingPaginationMetaDto {
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
 * Collection response for booking lists.
 */
export class PaginatedBookingResponseDto {
  @Expose()
  @Type(() => BookingResponseDto)
  items: BookingResponseDto[];

  @Expose()
  @Type(() => BookingPaginationMetaDto)
  meta: BookingPaginationMetaDto;
}
