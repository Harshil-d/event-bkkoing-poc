import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { JwtPayload } from '../dto/jwt-payload.interface';
import { AppConfiguration } from '../../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<AppConfiguration>('app').jwt.accessSecret,
    });
  }

  /**
   * Exposes the validated JWT payload to downstream request handlers.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
