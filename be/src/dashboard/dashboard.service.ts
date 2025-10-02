import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { DashboardSummaryDto } from './dto/dashboard-summary.dto';

@Injectable()
export class DashboardService {
  /**
   * Builds the high-level metrics tailored for administrators, including event and booking oversight.
   */
  async getAdminSummary(): Promise<DashboardSummaryDto> {
    const payload = {
      heading: 'Admin Dashboard',
      metrics: {
        totalEvents: 0,
        totalBookings: 0,
        activeUsers: 0,
      },
      notices: ['Connect database to view live admin metrics.'],
    };

    return plainToInstance(DashboardSummaryDto, payload);
  }

  /**
   * Constructs the per-user dashboard payload focusing on upcoming bookings and notifications.
   */
  async getUserSummary(userId: string): Promise<DashboardSummaryDto> {
    const payload = {
      heading: 'User Dashboard',
      metrics: {
        upcomingBookings: 0,
        notificationsUnread: 0,
      },
      notices: [`User ${userId} dashboard currently serves placeholder data.`],
    };

    return plainToInstance(DashboardSummaryDto, payload);
  }
}
