import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import {
  BookingEntity,
  BookingStatus,
} from '../database/entities/booking.entity';
import { EventEntity } from '../database/entities/event.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  BookingResponseDto,
  PaginatedBookingResponseDto,
  BookingPaginationMetaDto,
} from './dto/booking-response.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly dataSource: DataSource,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Books seats for an event using a pessimistic lock to avoid race conditions and overbooking.
   */
  async bookEvent(
    userId: string,
    payload: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const event = await manager
        .getRepository(EventEntity)
        .createQueryBuilder('event')
        .setLock('pessimistic_write')
        .where('event.id = :id', { id: payload.eventId })
        .getOne();

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      if (new Date(event.eventDate).getTime() < Date.now()) {
        throw new BadRequestException('Cannot book seats for past events');
      }

      if (payload.seats > event.seatsAvailable) {
        throw new BadRequestException('Insufficient seats available');
      }

      event.seatsAvailable -= payload.seats;

      await manager.getRepository(EventEntity).save(event);

      const bookingRecord = manager.getRepository(BookingEntity).create({
        userId,
        eventId: event.id,
        seatsBooked: payload.seats,
        status: BookingStatus.CONFIRMED,
      });

      const booking = await manager.getRepository(BookingEntity).save(bookingRecord);

      await this.notificationsService.createBookingConfirmationNotification(
        {
          userId,
          eventTitle: event.title,
          eventId: event.id,
          seats: payload.seats,
        },
        manager,
      );

      booking.event = event;

      return plainToInstance(BookingResponseDto, booking, {
        excludeExtraneousValues: true,
      });
    });
  }

  /**
   * Lists bookings made by the authenticated user with pagination support.
   */
  async listUserBookings(
    userId: string,
    query: ListBookingsDto,
  ): Promise<PaginatedBookingResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.event', 'event')
      .where('booking.userId = :userId', { userId })
      .orderBy('booking.createdAt', 'DESC');

    if (query.status) {
      qb.andWhere('booking.status = :status', { status: query.status });
    }

    const [items, totalItems] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = plainToInstance(BookingPaginationMetaDto, {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    });

    return plainToInstance(PaginatedBookingResponseDto, {
      items: plainToInstance(BookingResponseDto, items, {
        excludeExtraneousValues: true,
      }),
      meta,
    });
  }

  /**
   * Lists all bookings for administrative oversight.
   */
  async listAllBookings(query: ListBookingsDto): Promise<PaginatedBookingResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.event', 'event')
      .orderBy('booking.createdAt', 'DESC');

    if (query.status) {
      qb.where('booking.status = :status', { status: query.status });
    }

    const [items, totalItems] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const meta = plainToInstance(BookingPaginationMetaDto, {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit) || 1,
    });

    return plainToInstance(PaginatedBookingResponseDto, {
      items: plainToInstance(BookingResponseDto, items, {
        excludeExtraneousValues: true,
      }),
      meta,
    });
  }

  /**
   * Cancels a booking by the owner or an administrator while releasing the reserved seats.
   */
  async cancelBooking(
    bookingId: string,
    requestingUserId: string,
    isAdmin: boolean,
  ): Promise<BookingResponseDto> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const bookingRepo = manager.getRepository(BookingEntity);
      const eventRepo = manager.getRepository(EventEntity);

      const booking = await bookingRepo
        .createQueryBuilder('booking')
        .setLock('pessimistic_write')
        .where('booking.id = :id', { id: bookingId })
        .getOne();

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (!isAdmin && booking.userId !== requestingUserId) {
        throw new UnauthorizedException('You cannot cancel this booking');
      }

      if (booking.status === BookingStatus.CANCELLED) {
        return plainToInstance(BookingResponseDto, booking, {
          excludeExtraneousValues: true,
        });
      }

      const event = await eventRepo.findOne({ where: { id: booking.eventId } });

      if (!event) {
        throw new NotFoundException('Event not found');
      }

      booking.status = BookingStatus.CANCELLED;
      event.seatsAvailable += booking.seatsBooked;

      await eventRepo.save(event);
      const saved = await bookingRepo.save(booking);

      return plainToInstance(BookingResponseDto, saved, {
        excludeExtraneousValues: true,
      });
    });
  }
}
