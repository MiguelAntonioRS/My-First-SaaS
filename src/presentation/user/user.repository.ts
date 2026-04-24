import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../domain/user/entities/user.entity';
import { CreateUserDto } from '../../application/user/dto/user.dto';
import { NotFoundException, ConflictException } from '../../domain/common/exceptions';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findByEmail(email: string, tenantId: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email, tenantId },
      relations: ['role'],
    });
  }

  async findByTenantId(tenantId: string, queryOptions?: any): Promise<User[]> {
    const { page = 1, limit = 20, sort = 'createdAt', order = 'DESC' } = queryOptions || {};
    
    return this.repository.find({
      where: { tenantId },
      relations: ['role'],
      skip: (page - 1) * limit,
      take: limit,
      order: { [sort]: order },
    });
  }

  async count(tenantId: string): Promise<number> {
    return this.repository.count({ where: { tenantId } });
  }

  async create(data: Partial<User>): Promise<User> {
    if (!data.tenantId || !data.email) {
      throw new Error('tenantId and email are required');
    }
    const existingUser = await this.findByEmail(data.email, data.tenantId);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException('User', id);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { status: UserStatus.INACTIVE });
  }
}