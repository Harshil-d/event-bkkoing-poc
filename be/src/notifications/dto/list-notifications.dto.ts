import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsPositive, Min } from 'class-validator';

/**
 * Query parameters supported when retrieving user notifications.
 */
export class ListNotificationsDto {
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
  @Transform(({ value }) => (value !== undefined ? value === 'true' : undefined))
  @IsBoolean()
  unreadOnly?: boolean;
}
