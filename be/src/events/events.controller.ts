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
import { Request } from 'express';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ListEventsDto } from './dto/list-events.dto';
import {
  EventResponseDto,
  PaginatedEventResponseDto,
} from './dto/event-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Lists events with pagination and optional filtering for both administrators and users.
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  listEvents(@Query() query: ListEventsDto): Promise<PaginatedEventResponseDto> {
    return this.eventsService.listEvents(query);
  }

  /**
   * Retrieves the details for a specific event.
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getEvent(@Param('id', new ParseUUIDPipe()) id: string): Promise<EventResponseDto> {
    return this.eventsService.getEvent(id);
  }

  /**
   * Creates a new event and assigns the authenticated administrator as the creator.
   */
  @Post()
  @Roles(UserRole.ADMIN)
  createEvent(
    @Body() payload: CreateEventDto,
    @Req() request: Request,
  ): Promise<EventResponseDto> {
    const { user } = request as Request & { user: { sub: string } };
    return this.eventsService.createEvent(payload, user.sub);
  }

  /**
   * Updates an existing event while enforcing seat availability rules.
   */
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
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteEvent(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.eventsService.removeEvent(id);
  }
}
