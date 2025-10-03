import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingResponseDto, PaginatedBookingResponseDto } from './dto/booking-response.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Allows users to reserve seats for a given event.
   */
  @ApiOperation({
    summary: 'Create Booking',
    description:
      'Book seats for an event. Only users can create bookings. Requires authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        eventId: '456e7890-e89b-12d3-a456-426614174001',
        userId: '789e0123-e89b-12d3-a456-426614174002',
        numberOfSeats: 2,
        totalAmount: 199.98,
        status: 'CONFIRMED',
        bookingDate: '2024-01-15T14:30:00Z',
        createdAt: '2024-01-15T14:30:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
        event: {
          id: '456e7890-e89b-12d3-a456-426614174001',
          title: 'Tech Conference 2024',
          date: '2024-06-15T10:00:00Z',
          location: 'Convention Center, Hall A',
          price: 99.99,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - User access required' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid booking data or insufficient seats',
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiBody({
    description: 'Booking creation data',
    schema: {
      example: {
        eventId: '123e4567-e89b-12d3-a456-426614174000',
        seats: 2
      }
    }
  })
  @Post()
  @Roles(UserRole.USER)
  createBooking(
    @Body() payload: CreateBookingDto,
    @Req() request: Request,
  ): Promise<BookingResponseDto> {
    const { user } = request as Request & { user: { sub: string } };
    return this.bookingsService.bookEvent(user.sub, payload);
  }

  /**
   * Returns bookings that belong to the authenticated user.
   */
  @ApiOperation({
    summary: 'Get My Bookings',
    description:
      'Get paginated list of bookings for the authenticated user. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'User bookings retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            eventId: '456e7890-e89b-12d3-a456-426614174001',
            userId: '789e0123-e89b-12d3-a456-426614174002',
            numberOfSeats: 2,
            totalAmount: 199.98,
            status: 'CONFIRMED',
            bookingDate: '2024-01-15T14:30:00Z',
            createdAt: '2024-01-15T14:30:00Z',
            updatedAt: '2024-01-15T14:30:00Z',
            event: {
              id: '456e7890-e89b-12d3-a456-426614174001',
              title: 'Tech Conference 2024',
              date: '2024-06-15T10:00:00Z',
              location: 'Convention Center, Hall A',
              price: 99.99,
            },
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - User access required' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)', example: 10 })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by booking status', example: 'CONFIRMED', enum: ['CONFIRMED', 'CANCELLED'] })
  @Get('my-bookings')
  @Roles(UserRole.USER)
  listMyBookings(
    @Req() request: Request,
    @Query() query: ListBookingsDto,
  ): Promise<PaginatedBookingResponseDto> {
    const { user } = request as Request & { user: { sub: string } };
    return this.bookingsService.listUserBookings(user.sub, query);
  }

  /**
   * Provides administrators with visibility into all bookings.
   */
  @ApiOperation({
    summary: 'Get All Bookings',
    description:
      'Get paginated list of all bookings in the system. Only administrators can access this endpoint. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'All bookings retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            eventId: '456e7890-e89b-12d3-a456-426614174001',
            userId: '789e0123-e89b-12d3-a456-426614174002',
            numberOfSeats: 2,
            totalAmount: 199.98,
            status: 'CONFIRMED',
            bookingDate: '2024-01-15T14:30:00Z',
            createdAt: '2024-01-15T14:30:00Z',
            updatedAt: '2024-01-15T14:30:00Z',
            event: {
              id: '456e7890-e89b-12d3-a456-426614174001',
              title: 'Tech Conference 2024',
              date: '2024-06-15T10:00:00Z',
              location: 'Convention Center, Hall A',
              price: 99.99,
            },
            user: {
              id: '789e0123-e89b-12d3-a456-426614174002',
              fullName: 'John Doe',
              email: 'john@example.com',
            },
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)', example: 10 })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by booking status', example: 'CONFIRMED', enum: ['CONFIRMED', 'CANCELLED'] })
  @Get()
  @Roles(UserRole.ADMIN)
  listAllBookings(@Query() query: ListBookingsDto): Promise<PaginatedBookingResponseDto> {
    return this.bookingsService.listAllBookings(query);
  }

  /**
   * Cancels an existing booking, unlocking seats for the event.
   */
  @ApiOperation({
    summary: 'Cancel Booking',
    description:
      'Cancel an existing booking. Users can cancel their own bookings, admins can cancel any booking. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        eventId: '456e7890-e89b-12d3-a456-426614174001',
        userId: '789e0123-e89b-12d3-a456-426614174002',
        numberOfSeats: 2,
        totalAmount: 199.98,
        status: 'CANCELLED',
        bookingDate: '2024-01-15T14:30:00Z',
        createdAt: '2024-01-15T14:30:00Z',
        updatedAt: '2024-01-15T16:45:00Z',
        event: {
          id: '456e7890-e89b-12d3-a456-426614174001',
          title: 'Tech Conference 2024',
          date: '2024-06-15T10:00:00Z',
          location: 'Convention Center, Hall A',
          price: 99.99,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot cancel this booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 400, description: 'Bad Request - Booking cannot be cancelled' })
  @Patch(':id/cancel')
  @Roles(UserRole.USER, UserRole.ADMIN)
  cancelBooking(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: Request,
  ): Promise<BookingResponseDto> {
    const { user } = request as Request & { user: { sub: string; role: UserRole } };
    const isAdmin = user.role === UserRole.ADMIN;
    return this.bookingsService.cancelBooking(id, user.sub, isAdmin);
  }
}
