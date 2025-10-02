import { IsInt, IsPositive, IsString, IsUUID } from 'class-validator';

/**
 * Payload received from end-users when booking seats for an event.
 */
export class CreateBookingDto {
  @IsUUID()
  eventId: string;

  @IsInt()
  @IsPositive()
  seats: number;
}
