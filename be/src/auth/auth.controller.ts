import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticates administrators and returns dashboard-ready access tokens.
   */
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() payload: AdminLoginDto): Promise<AuthResponseDto> {
    return this.authService.adminLogin(payload);
  }

  /**
   * Authenticates standard users and returns access tokens tailored for the user workspace.
   */
  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  userLogin(@Body() payload: UserLoginDto): Promise<AuthResponseDto> {
    return this.authService.userLogin(payload);
  }

  /**
   * Registers a new user with USER role and returns access tokens.
   */
  @Post('user/register')
  @HttpCode(HttpStatus.CREATED)
  userRegister(@Body() payload: UserRegisterDto): Promise<AuthResponseDto> {
    return this.authService.userRegister(payload);
  }

  /**
   * Registers a new admin with ADMIN role and returns access tokens.
   */
  @Post('admin/register')
  @HttpCode(HttpStatus.CREATED)
  adminRegister(@Body() payload: AdminRegisterDto): Promise<AuthResponseDto> {
    return this.authService.adminRegister(payload);
  }
}
