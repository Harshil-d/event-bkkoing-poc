import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig, {
  buildTypeOrmOptions,
  DatabaseConfiguration,
} from '../config/database.config';
import { UserEntity } from './entities/user.entity';
import { EventEntity } from './entities/event.entity';
import { BookingEntity } from './entities/booking.entity';
import { NotificationEntity } from './entities/notification.entity';
// import { CustomNamingStrategy } from '@app/utils/typeorm-custom-naming-strategy.util';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<DatabaseConfiguration>('database');
        return {
          ...buildTypeOrmOptions(config),
          entities: [UserEntity, EventEntity, BookingEntity, NotificationEntity],
          // namingStrategy: new CustomNamingStrategy(),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
