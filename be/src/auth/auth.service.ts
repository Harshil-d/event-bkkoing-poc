import { Injectable, UnauthorizedException, ForbiddenException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';

import { UsersService } from '../users/users.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { UserRole } from '../database/entities/user.entity';
import { AuthResponseDto, AuthenticatedUserDto, AuthTokensDto } from './dto/auth-response.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import { AppConfiguration } from '../config/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Processes the admin login flow by validating credentials and asserting the ADMIN role.
   */
  async adminLogin(payload: AdminLoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.validateCredentials(payload.email, payload.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin privileges required');
    }

    return this.buildAuthResponse(user.id, user.fullName, user.email, user.role);
  }

  /**
   * Processes the user login flow by validating credentials and asserting the USER role.
   */
  async userLogin(payload: UserLoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.validateCredentials(payload.email, payload.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== UserRole.USER) {
      throw new ForbiddenException('User access required');
    }

    return this.buildAuthResponse(user.id, user.fullName, user.email, user.role);
  }

  /**
   * Issues a fresh pair of access and refresh tokens for the provided subject.
   */
  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<AuthTokensDto> {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshSecret = this.configService.getOrThrow<AppConfiguration>('app').jwt.refreshSecret;
    const refreshExpiresIn = this.configService.getOrThrow<AppConfiguration>('app').jwt.refreshExpiresIn;

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    return plainToInstance(AuthTokensDto, { accessToken, refreshToken });
  }

  /**
   * Registers a new user with USER role.
   */
  async userRegister(payload: UserRegisterDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(payload.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create new user with USER role
    const user = await this.usersService.createUser(
      payload.email,
      payload.password,
      payload.fullName,
      UserRole.USER,
    );

    return this.buildAuthResponse(user.id, user.fullName, user.email, user.role);
  }

  /**
   * Registers a new admin with ADMIN role.
   */
  async adminRegister(payload: AdminRegisterDto): Promise<AuthResponseDto> {
    // Check if admin already exists
    const existingUser = await this.usersService.findByEmail(payload.email);
    if (existingUser) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Create new admin with ADMIN role
    const user = await this.usersService.createUser(
      payload.email,
      payload.password,
      payload.fullName,
      UserRole.ADMIN,
    );

    return this.buildAuthResponse(user.id, user.fullName, user.email, user.role);
  }

  /**
   * Builds the API response combining the serialized user profile with freshly minted tokens.
   */
  private async buildAuthResponse(
    id: string,
    fullName: string,
    email: string,
    role: string,
  ): Promise<AuthResponseDto> {
    const tokens = await this.generateTokens(id, email, role);
    const user = plainToInstance(AuthenticatedUserDto, { id, fullName, email, role });

    return plainToInstance(AuthResponseDto, { user, tokens });
  }
}
