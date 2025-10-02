import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Supplies the static health-check response ensuring upstream controllers remain thin.
   */
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
