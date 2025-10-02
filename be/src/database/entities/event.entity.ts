import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp with time zone' })
  eventDate: Date;

  @Column({ type: 'int' })
  totalSeats: number;

  @Column({ type: 'int' })
  seatsAvailable: number;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => UserEntity, (user) => user.eventsCreated, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'createdById',
  })
  createdBy: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  updatedById?: string | null;

  @ManyToOne(() => UserEntity, (user) => user.eventsUpdated, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'updatedById',
  })
  updatedBy?: UserEntity | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @OneToMany(() => BookingEntity, (booking) => booking.event)
  bookings: BookingEntity[];
}
