import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { EventEntity } from '../database/entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  EventResponseDto,
  PaginatedEventResponseDto,
  PaginationMetaDto,
} from './dto/event-response.dto';
import { ListEventsDto } from './dto/list-events.dto';
import { BookingEntity, BookingStatus } from '../database/entities/booking.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  /**
   * Fetches events with pagination, search, and date range filtering support.
   */
  async listEvents(query: ListEventsDto): Promise<PaginatedEventResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const qb = this.eventRepository.createQueryBuilder('event');

    if (query.search) {
      qb.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search)',
        {
          search: `%${query.search}%`,
        },
      );
    }

    if (query.dateFrom) {
      qb.andWhere('event.eventDate >= :dateFrom', {
        dateFrom: query.dateFrom,
      });
    }

    if (query.dateTo) {
      qb.andWhere('event.eventDate <= :dateTo', {
        dateTo: query.dateTo,
      });
    }

    qb.orderBy('event.eventDate', 'ASC');

    const [items, totalItems] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = plainToInstance(PaginationMetaDto, {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    });

    return plainToInstance(PaginatedEventResponseDto, {
      items: plainToInstance(EventResponseDto, items),
      meta,
    });
  }

  /**
   * Retrieves a single event by identifier or raises when absent.
   */
  async findEventById(id: string): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  /**
   * Returns an event DTO to consumers after ensuring it exists.
   */
  async getEvent(id: string): Promise<EventResponseDto> {
    const event = await this.findEventById(id);
    return plainToInstance(EventResponseDto, event);
  }

  /**
   * Creates a new event on behalf of the given administrator.
   */
  async createEvent(payload: CreateEventDto, adminId: string): Promise<EventResponseDto> {
    const event = this.eventRepository.create({
      ...payload,
      eventDate: new Date(payload.eventDate),
      seatsAvailable: payload.totalSeats,
      createdById: adminId,
      updatedById: adminId,
    });

    const saved = await this.eventRepository.save(event);
    return plainToInstance(EventResponseDto, saved);
  }

  /**
   * Applies administrator-requested changes to an existing event while ensuring seat counts remain valid.
   */
  async updateEvent(
    id: string,
    payload: UpdateEventDto,
    adminId: string,
  ): Promise<EventResponseDto> {
    const event = await this.findEventById(id);

    const bookedSeats = event.totalSeats - event.seatsAvailable;

    if (payload.totalSeats !== undefined) {
      if (payload.totalSeats < bookedSeats) {
        throw new BadRequestException(
          'Total seats cannot be less than already booked seats',
        );
      }

      event.totalSeats = payload.totalSeats;
      event.seatsAvailable = payload.totalSeats - bookedSeats;
    }

    if (payload.title !== undefined) {
      event.title = payload.title;
    }

    if (payload.description !== undefined) {
      event.description = payload.description;
    }

    if (payload.eventDate !== undefined) {
      event.eventDate = new Date(payload.eventDate);
    }

    if (payload.price !== undefined) {
      event.price = payload.price;
    }

    if (payload.location !== undefined) {
      event.location = payload.location;
    }

    event.updatedById = adminId;

    const saved = await this.eventRepository.save(event);
    return plainToInstance(EventResponseDto, saved);
  }

  /**
   * Removes an event when no confirmed bookings remain.
   */
  async removeEvent(id: string): Promise<void> {
    const event = await this.findEventById(id);

    const activeBookings = await this.bookingRepository.count({
      where: { eventId: event.id, status: BookingStatus.CONFIRMED },
    });

    if (activeBookings > 0) {
      throw new BadRequestException('Cannot delete event with confirmed bookings');
    }

    await this.eventRepository.remove(event);
  }
}
