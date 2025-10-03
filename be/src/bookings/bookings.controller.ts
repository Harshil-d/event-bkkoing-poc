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
import {
  CreateBookingSuccessResponseExample,
  ListMyBookingsSuccessResponseExample,
  ListAllBookingsSuccessResponseExample,
  CancelBookingSuccessResponseExample,
  CreateBookingBodyExample,
} from './dto/api-response-examples.dto';
import {
  CommonErrorResponses,
  BookingErrorResponses,
  PaginationQueryExamples,
} from '../common/dto/api-response-examples.dto';
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
  @ApiResponse(CreateBookingSuccessResponseExample)
  @ApiResponse(CommonErrorResponses.unauthorized)
  @ApiResponse(BookingErrorResponses.userAccessRequired)
  @ApiResponse(BookingErrorResponses.insufficientSeats)
  @ApiResponse(BookingErrorResponses.pastEvent)
  @ApiResponse(CommonErrorResponses.notFound)
  @ApiBody(CreateBookingBodyExample)
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
  @ApiResponse(ListMyBookingsSuccessResponseExample)
  @ApiResponse(CommonErrorResponses.unauthorized)
  @ApiResponse(BookingErrorResponses.userAccessRequired)
  @ApiQuery(PaginationQueryExamples.page)
  @ApiQuery(PaginationQueryExamples.limit)
  @ApiQuery(PaginationQueryExamples.status)
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
  @ApiResponse(ListAllBookingsSuccessResponseExample)
  @ApiResponse(CommonErrorResponses.unauthorized)
  @ApiResponse(BookingErrorResponses.adminAccessRequired)
  @ApiQuery(PaginationQueryExamples.page)
  @ApiQuery(PaginationQueryExamples.limit)
  @ApiQuery(PaginationQueryExamples.status)
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
  @ApiResponse(CancelBookingSuccessResponseExample)
  @ApiResponse(CommonErrorResponses.unauthorized)
  @ApiResponse(BookingErrorResponses.cannotCancelThis)
  @ApiResponse(CommonErrorResponses.notFound)
  @ApiResponse(BookingErrorResponses.cannotCancel)
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
