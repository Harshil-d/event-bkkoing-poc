import { registerAs } from '@nestjs/config';

export interface AppConfiguration {
  port: number;
  globalPrefix: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
}

export default registerAs(
  'app',
  (): AppConfiguration => ({
    port: parseInt(process.env.APP_PORT ?? '3001', 10),
    globalPrefix: process.env.APP_GLOBAL_PREFIX ?? 'api',
    jwt: {
      accessSecret: process.env.APP_JWT_ACCESS_SECRET ?? 'development-access-secret',
      refreshSecret: process.env.APP_JWT_REFRESH_SECRET ?? 'development-refresh-secret',
      accessExpiresIn: process.env.APP_JWT_ACCESS_EXPIRES_IN ?? '900s',
      refreshExpiresIn: process.env.APP_JWT_REFRESH_EXPIRES_IN ?? '7d',
    },
  }),
);
