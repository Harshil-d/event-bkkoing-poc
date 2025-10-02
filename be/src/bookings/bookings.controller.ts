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
import { Request } from 'express';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  BookingResponseDto,
  PaginatedBookingResponseDto,
} from './dto/booking-response.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Allows users to reserve seats for a given event.
   */
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
  @Get('my')
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
  @Get()
  @Roles(UserRole.ADMIN)
  listAllBookings(
    @Query() query: ListBookingsDto,
  ): Promise<PaginatedBookingResponseDto> {
    return this.bookingsService.listAllBookings(query);
  }

  /**
   * Cancels an existing booking, unlocking seats for the event.
   */
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
