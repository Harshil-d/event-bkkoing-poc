import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, IsNumber, Min } from 'class-validator';

/**
 * Payload contract for administrators creating a new event listing.
 */
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  eventDate: string;

  @IsInt()
  @IsPositive()
  totalSeats: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;
}
