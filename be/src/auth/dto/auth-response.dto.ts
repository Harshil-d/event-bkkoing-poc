import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDto {
  @ApiProperty({
    description: 'JWT access token for API authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token for token renewal',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  refreshToken: string;
}

export class AuthenticatedUserDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Expose()
  fullName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    enum: ['USER', 'ADMIN'],
  })
  @Expose()
  role: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Authenticated user information',
    type: AuthenticatedUserDto,
  })
  @Expose()
  @Type(() => AuthenticatedUserDto)
  user: AuthenticatedUserDto;

  @ApiProperty({
    description: 'Authentication tokens',
    type: AuthTokensDto,
  })
  @Expose()
  @Type(() => AuthTokensDto)
  tokens: AuthTokensDto;
}
