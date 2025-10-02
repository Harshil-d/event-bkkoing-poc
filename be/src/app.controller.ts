import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns a simple health-check payload that can be used for uptime monitoring and smoke tests.
   */
  @Get('health')
  getHealth(): { status: string } {
    return this.appService.getHealth();
  }
}
