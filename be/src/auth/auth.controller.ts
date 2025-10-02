import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserLoginDto } from './dto/user-login.dto';
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
}
