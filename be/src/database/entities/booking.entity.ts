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

@Entity({ name: 'bookings' })
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;

  @Column()
  eventId: number;

  @ManyToOne(() => EventEntity, (event) => event.id)
  @JoinColumn({
    name: 'eventId',
  })
  event: EventEntity;

  @Column({ type: 'int' })
  seatsBooked: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
