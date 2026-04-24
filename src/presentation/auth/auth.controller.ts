import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../infrastructure/authentication/guards/jwt-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';
import { TenantDecorator } from '../../shared/decorators/params.decorator';
import { LoginDto, RegisterDto, RefreshTokenDto } from '../../application/auth/dto/auth.dto';
import { Tenant } from '../../domain/tenant/entities/tenant.entity';

@ApiTags('auth')
@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  async login(@Body() dto: LoginDto, @TenantDecorator() tenant: Tenant) {
    return this.authService.login(dto, tenant?.id || 'default');
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto, @TenantDecorator() tenant: Tenant) {
    return this.authService.register(dto, tenant?.id || 'default');
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  async logout() {
    return { message: 'Logged out successfully' };
  }
}