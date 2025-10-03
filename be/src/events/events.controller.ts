import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';

import { EventsService } from './events.service';
import {
  CreateCommuneSuccessResponseExample,
  CreateEventDto,
  FetchEventSuccessResponseExample,
  NotFoundExampleResponse,
  UnauthorizedExampleResponse,
} from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ListEventsDto } from './dto/list-events.dto';
import { EventResponseDto, PaginatedEventResponseDto } from './dto/event-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@ApiTags('Events')
@ApiBearerAuth('JWT-auth')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Lists events with pagination and optional filtering for both administrators and users.
   */
  @ApiOperation({
    summary: 'List Events',
    description: 'Get paginated list of events. Requires authentication.',
  })
  @ApiResponse(CreateCommuneSuccessResponseExample)
  @ApiResponse(UnauthorizedExampleResponse)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  listEvents(@Query() dto: ListEventsDto): Promise<PaginatedEventResponseDto> {
    return this.eventsService.listEvents(dto);
  }

  /**
   * Retrieves the details for a specific event.
   */
  @ApiOperation({
    summary: 'Get Event Details',
    description: 'Get detailed information about a specific event by ID. Requires authentication.',
  })
  @ApiResponse(FetchEventSuccessResponseExample)
  @ApiResponse(UnauthorizedExampleResponse)
  @ApiResponse(NotFoundExampleResponse)
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getEvent(@Param('id', new ParseUUIDPipe()) id: string): Promise<EventResponseDto> {
    return this.eventsService.getEvent(id);
  }

  /**
   * Creates a new event and assigns the authenticated administrator as the creator.
   */
  @ApiOperation({
    summary: 'Create Event',
    description:
      'Create a new event. Only administrators can create events. Requires authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'New Tech Conference 2024',
        description: 'A brand new technology conference',
        date: '2024-07-20T09:00:00Z',
        location: 'Tech Hub Convention Center',
        totalSeats: 300,
        availableSeats: 300,
        price: 149.99,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid event data' })
  @ApiBody({
    description: 'Event creation data',
    schema: {
      example: {
        title: 'Tech Conference 2024',
        description:
          'Annual technology conference featuring the latest innovations in software development, AI, and cloud computing. Join industry leaders for networking and knowledge sharing.',
        eventDate: '2024-06-15T10:00:00Z',
        totalSeats: 500,
        price: 99.99,
        location: 'Convention Center, Hall A',
      },
    },
  })
  @Post()
  @Roles(UserRole.ADMIN)
  createEvent(@Body() payload: CreateEventDto, @Req() request: Request): Promise<EventResponseDto> {
    const { user } = request as Request & { user: { sub: string } };
    return this.eventsService.createEvent(payload, user.sub);
  }

  /**
   * Updates an existing event while enforcing seat availability rules.
   */
  @ApiOperation({
    summary: 'Update Event',
    description:
      'Update an existing event. Only administrators can update events. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Updated Tech Conference 2024',
        description: 'Updated description for the technology conference',
        date: '2024-06-15T10:00:00Z',
        location: 'Updated Convention Center, Hall B',
        totalSeats: 600,
        availableSeats: 550,
        price: 129.99,
        createdAt: '2024-01-15T08:30:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid update data' })
  @ApiBody({
    description: 'Event update data (all fields are optional)',
    schema: {
      example: {
        title: 'Updated Tech Conference 2024',
        description:
          'Updated description for the technology conference with new speakers and agenda.',
        eventDate: '2024-06-20T09:00:00Z',
        totalSeats: 600,
        price: 129.99,
        location: 'Updated Convention Center, Hall B',
      },
    },
  })
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  updateEvent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() payload: UpdateEventDto,
    @Req() request: Request,
  ): Promise<EventResponseDto> {
    const { user } = request as Request & { user: { sub: string } };
    return this.eventsService.updateEvent(id, payload, user.sub);
  }

  /**
   * Deletes an event provided there are no confirmed bookings tied to it.
   */
  @ApiOperation({
    summary: 'Delete Event',
    description:
      'Delete an event. Only administrators can delete events. Event cannot be deleted if it has confirmed bookings. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Cannot delete event with confirmed bookings',
  })
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteEvent(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.eventsService.removeEvent(id);
  }
}
