import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column()
  createdById?: number | undefined;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'createdById',
  })
  createdBy: UserEntity;

  @Column({ nullable: true })
  updatedById?: number | undefined;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'updatedById',
  })
  updatedBy?: UserEntity | undefined;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => BookingEntity, (booking) => booking.event)
  bookings: BookingEntity[];
}
