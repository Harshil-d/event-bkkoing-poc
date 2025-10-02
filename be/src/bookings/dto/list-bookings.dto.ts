import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Min } from 'class-validator';

import { BookingStatus } from '../../database/entities/booking.entity';

/**
 * Query parameters accepted when requesting booking collections.
 */
export class ListBookingsDto {
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => (value ? String(value).toUpperCase() : undefined))
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
