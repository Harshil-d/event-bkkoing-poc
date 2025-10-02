import { IsDateString, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

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
}
