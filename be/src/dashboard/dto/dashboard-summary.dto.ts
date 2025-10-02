import { Expose } from 'class-transformer';

export class DashboardSummaryDto {
  @Expose()
  heading: string;

  @Expose()
  metrics: Record<string, number>;

  @Expose()
  notices: string[];
}
