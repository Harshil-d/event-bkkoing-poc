import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity, UserRole } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Retrieves a user record by email address; this powers authentication flows and uniqueness validation.
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Validates plain-text credentials against the persisted password hash and ensures the user is active.
   */
  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Pick<UserEntity, 'id' | 'role' | 'fullName' | 'email'> | null> {
    const user = await this.findByEmail(email);

    if (!user || !user.isActive) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return null;
    }

    return {
      id: user.id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
    };
  }

  /**
   * Persists a new user while hashing the provided password and selecting the correct role profile.
   */
  async createUser(
    email: string,
    password: string,
    fullName: string,
    role: UserRole = UserRole.USER,
  ): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      email,
      password: passwordHash,
      fullName,
      role,
    });

    return this.userRepository.save(user);
  }
}
