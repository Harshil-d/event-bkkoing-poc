import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { DashboardService } from './dashboard.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Serves the admin dashboard overview containing platform-wide operational insights.
   */
  @Get('admin')
  @Roles(UserRole.ADMIN)
  adminDashboard(): Promise<DashboardSummaryDto> {
    return this.dashboardService.getAdminSummary();
  }

  /**
   * Delivers the user dashboard payload scoped to the authenticated principal.
   */
  @Get('user')
  @Roles(UserRole.USER)
  userDashboard(@Req() request: Request): Promise<DashboardSummaryDto> {
    const { user } = request as Request & { user: { sub: string } };
    return this.dashboardService.getUserSummary(user.sub);
  }
}
