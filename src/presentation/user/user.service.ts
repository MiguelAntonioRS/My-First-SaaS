import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user/entities/user.entity';
import { UserRepository } from './user.repository';
import { PasswordService } from '../../infrastructure/authentication/password.service';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../../application/user/dto/user.dto';
import { NotFoundException } from '../../domain/common/exceptions';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User', id);
    }
    return user;
  }

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    return this.userRepository.findByEmail(email, tenantId);
  }

  async findByTenantId(tenantId: string, queryOptions?: any): Promise<{ users: User[]; total: number }> {
    const users = await this.userRepository.findByTenantId(tenantId, queryOptions);
    const total = await this.userRepository.count(tenantId);
    return { users, total };
  }

  async create(dto: CreateUserDto, tenantId: string): Promise<User> {
    const hashedPassword = await this.passwordService.hash(dto.password);
    
    return this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      jobTitle: dto.jobTitle,
      roleId: dto.roleId,
      tenantId,
    });
  }

  async update(id: string, dto: UpdateUserDto, tenantId: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user || user.tenantId !== tenantId) {
      throw new NotFoundException('User', id);
    }

    return this.userRepository.update(id, dto);
  }

  async changePassword(id: string, dto: ChangePasswordDto, tenantId: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user || user.tenantId !== tenantId) {
      throw new NotFoundException('User', id);
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    const newHashedPassword = await this.passwordService.hash(dto.newPassword);
    await this.userRepository.update(id, { password: newHashedPassword });
  }
}