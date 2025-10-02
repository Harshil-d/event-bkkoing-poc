import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { BookingEntity } from './booking.entity';

@Entity({ name: 'events' })
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'event_date', type: 'timestamptz' })
  eventDate: Date;

  @Column({ name: 'total_seats', type: 'int' })
  totalSeats: number;

  @Column({ name: 'seats_available', type: 'int' })
  seatsAvailable: number;

  @ManyToOne(() => UserEntity, (user) => user.events)
  createdBy: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @OneToMany(() => BookingEntity, (booking) => booking.event)
  bookings: BookingEntity[];
}
