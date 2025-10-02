import { IsDateString, IsInt, IsOptional, IsPositive, IsString, MaxLength, IsNumber, Min } from 'class-validator';

/**
 * Payload contract for administrators updating an existing event while supporting partial updates.
 */
export class UpdateEventDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  totalSeats?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;
}
