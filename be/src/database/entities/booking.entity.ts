import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

@Entity({ name: 'bookings' })
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  user: UserEntity;

  @ManyToOne(() => EventEntity, (event) => event.bookings)
  event: EventEntity;

  @Column({ name: 'seats_booked', type: 'int' })
  seatsBooked: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
