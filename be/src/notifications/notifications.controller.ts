import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { NotificationsService } from './notifications.service';
import { PaginatedNotificationResponseDto, NotificationResponseDto } from './dto/notification-response.dto';
import { ListNotificationsDto } from './dto/list-notifications.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Returns notifications for the authenticated user.
   */
  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  listNotifications(
    @Req() request: Request,
    @Query() query: ListNotificationsDto,
  ): Promise<PaginatedNotificationResponseDto> {
    const { user } = request as Request & { user: { sub: string } };
    return this.notificationsService.listUserNotifications(user.sub, query);
  }

  /**
   * Marks a given notification as read for the authenticated user.
   */
  @Patch(':id/read')
  @Roles(UserRole.USER, UserRole.ADMIN)
  markAsRead(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: Request,
  ): Promise<NotificationResponseDto> {
    const { user } = request as Request & { user: { sub: string } };
    return this.notificationsService.markNotificationAsRead(id, user.sub);
  }
}
