import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AuthResponseDto, AuthTokensDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates administrators and returns dashboard-ready access tokens.
   */
  @ApiOperation({
    summary: 'Admin Login',
    description:
      'Authenticate admin user and get access token. Use the returned accessToken in Authorization header for protected endpoints.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          fullName: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
        },
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    description: 'Admin login credentials',
    schema: {
      example: {
        email: 'admin@example.com',
        password: 'AdminPass123!',
      },
    },
  })
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() payload: AdminLoginDto): Promise<AuthResponseDto> {
    return this.authService.adminLogin(payload);
  }

  /**
   * Authenticates standard users and returns access tokens tailored for the user workspace.
   */
  @ApiOperation({
    summary: 'User Login',
    description:
      'Authenticate regular user and get access token. Use the returned accessToken in Authorization header for protected endpoints.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          fullName: 'John Doe',
          email: 'user@example.com',
          role: 'USER',
        },
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    description: 'User login credentials',
    schema: {
      example: {
        email: 'user@example.com',
        password: 'UserPass123!',
      },
    },
  })
  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  userLogin(@Body() payload: UserLoginDto): Promise<AuthResponseDto> {
    return this.authService.userLogin(payload);
  }

  /**
   * Registers a new user with USER role and returns access tokens.
   */
  @ApiBody({
    description: 'User registration data',
    schema: {
      example: {
        email: 'newuser@example.com',
        password: 'UserPass123!',
        fullName: 'John Doe',
      },
    },
  })
  @Post('user/register')
  @HttpCode(HttpStatus.CREATED)
  userRegister(@Body() payload: UserRegisterDto): Promise<AuthResponseDto> {
    return this.authService.userRegister(payload);
  }

  /**
   * Registers a new admin with ADMIN role and returns access tokens.
   */
  @ApiBody({
    description: 'Admin registration data',
    schema: {
      example: {
        email: 'newadmin@example.com',
        password: 'AdminPass123!',
        fullName: 'Admin User',
      },
    },
  })
  @Post('admin/register')
  @HttpCode(HttpStatus.CREATED)
  adminRegister(@Body() payload: AdminRegisterDto): Promise<AuthResponseDto> {
    return this.authService.adminRegister(payload);
  }

  /**
   * Refreshes access token using refresh token.
   */
  @ApiOperation({
    summary: 'Refresh Token',
    description:
      'Get new access token using refresh token. Include refresh token in Authorization header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({
    description: 'Refresh token data',
    schema: {
      example: {
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() payload: { refreshToken: string }): Promise<AuthTokensDto> {
    return this.authService.refreshToken(payload.refreshToken);
  }
}
