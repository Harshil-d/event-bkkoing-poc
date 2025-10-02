import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { EventEntity } from './event.entity';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'bookings' })
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;

  @Column({ type: 'uuid' })
  eventId: string;

  @ManyToOne(() => EventEntity, (event) => event.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'eventId',
  })
  event: EventEntity;

  @Column({ type: 'int' })
  seatsBooked: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
