import { Expose, Type } from 'class-transformer';

/**
 * Shape of event records presented to API consumers.
 */
export class EventResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => Date)
  eventDate: Date;

  @Expose()
  totalSeats: number;

  @Expose()
  seatsAvailable: number;

  @Expose()
  createdById: string;

  @Expose()
  updatedById?: string | null;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}

/**
 * Metadata returned alongside paginated event collections.
 */
export class PaginationMetaDto {
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
 * Wrapper for event lists that includes pagination metadata.
 */
export class PaginatedEventResponseDto {
  @Expose()
  @Type(() => EventResponseDto)
  items: EventResponseDto[];

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}
