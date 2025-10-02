import { Expose, Type } from 'class-transformer';

export class AuthTokensDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}

export class AuthenticatedUserDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  role: string;
}

export class AuthResponseDto {
  @Expose()
  @Type(() => AuthenticatedUserDto)
  user: AuthenticatedUserDto;

  @Expose()
  @Type(() => AuthTokensDto)
  tokens: AuthTokensDto;
}
