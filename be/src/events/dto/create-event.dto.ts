import { HttpStatus } from '@nestjs/common';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

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

export const CreateCommuneSuccessResponseExample = {
  status: HttpStatus.CREATED,
  description: 'Success.',
  schema: {
    example: {
      data: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Tech Conference 2024',
          description: 'Annual technology conference',
          date: '2024-06-15T10:00:00Z',
          location: 'Convention Center',
          totalSeats: 500,
          availableSeats: 450,
          price: 99.99,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    },
  },
};

export const UnauthorizedExampleResponse = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized.',
  schema: {
    example: {
      message: 'Unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED,
    },
  },
};

export const NotFoundExampleResponse = {
  status: HttpStatus.NOT_FOUND,
  description: 'Not Found.',
  schema: {
    example: {
      message: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
  },
};

export const FetchEventSuccessResponseExample = {
  status: HttpStatus.CREATED,
  description: 'Success.',
  schema: {
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Tech Conference 2024',
      description:
        'Annual technology conference featuring the latest innovations in software development, AI, and cloud computing.',
      date: '2024-06-15T10:00:00Z',
      location: 'Convention Center, Hall A',
      totalSeats: 500,
      availableSeats: 450,
      price: 99.99,
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2024-01-15T08:30:00Z',
    },
  },
};
