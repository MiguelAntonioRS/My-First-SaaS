import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../infrastructure/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles, Permissions } from '../../shared/decorators/roles.decorator';
import { TenantDecorator, UserDecorator, PaginationDecorator } from '../../shared/decorators/params.decorator';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../../application/user/dto/user.dto';
import { Tenant } from '../../domain/tenant/entities/tenant.entity';
import { User, UserStatus } from '../../domain/user/entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'users', version: ['1'] })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('tenant_admin', 'manager')
  @ApiOperation({ summary: 'Get all users for tenant' })
  async findAll(
    @TenantDecorator() tenant: Tenant,
    @PaginationDecorator() pagination: any,
  ) {
    const { users, total } = await this.userService.findByTenantId(
      tenant.id,
      pagination,
    );
    
    return {
      data: users,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  @Get(':id')
  @Permissions('users.read')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(
    @Param('id') id: string,
    @TenantDecorator() tenant: Tenant,
  ) {
    const user = await this.userService.findById(id);
    if (user.tenantId !== tenant.id) {
      throw new Error('User not found');
    }
    return user;
  }

  @Post()
  @Roles('tenant_admin')
  @ApiOperation({ summary: 'Create new user' })
  async create(
    @Body() dto: CreateUserDto,
    @TenantDecorator() tenant: Tenant,
  ) {
    return this.userService.create(dto, tenant.id);
  }

  @Put(':id')
  @Permissions('users.update')
  @ApiOperation({ summary: 'Update user' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @TenantDecorator() tenant: Tenant,
  ) {
    return this.userService.update(id, dto, tenant.id);
  }

  @Put(':id/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @TenantDecorator() tenant: Tenant,
  ) {
    await this.userService.changePassword(id, dto, tenant.id);
    return { message: 'Password changed successfully' };
  }

  @Delete(':id')
  @Roles('tenant_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  async delete(
    @Param('id') id: string,
    @TenantDecorator() tenant: Tenant,
  ) {
    await this.userService.update(id, { status: UserStatus.INACTIVE }, tenant.id);
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@UserDecorator() user: User) {
    return user;
  }
}