import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtTokenService } from '../../infrastructure/authentication/jwt-token.service';
import { PasswordService } from '../../infrastructure/authentication/password.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from '../../application/auth/dto/auth.dto';
import { AuthenticationException } from '../../domain/common/exceptions';
import { User } from '../../domain/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(dto: LoginDto, tenantId: string) {
    const user = await this.userService.findByEmail(dto.email, tenantId);
    
    if (!user) {
      throw new AuthenticationException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AuthenticationException('Invalid credentials');
    }

    const tokens = await this.jwtTokenService.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: 'Bearer',
      user: this.sanitizeUser(user),
    };
  }

  async register(dto: RegisterDto, tenantId: string) {
    const existingUser = await this.userService.findByEmail(dto.email, tenantId);
    
    if (existingUser) {
      throw new AuthenticationException('Email already registered');
    }

    const user = await this.userService.create({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      tenantId,
    } as any, tenantId);

    const tokens = await this.jwtTokenService.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: 'Bearer',
      user: this.sanitizeUser(user),
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtTokenService.verifyRefreshToken(dto.refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new AuthenticationException('Invalid token type');
      }

      const user = await this.userService.findById(payload.sub);
      
      if (!user || user.tenantId !== payload.tenantId) {
        throw new AuthenticationException('User not found');
      }

      const tokens = await this.jwtTokenService.generateTokens(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        tokenType: 'Bearer',
      };
    } catch (error) {
      throw new AuthenticationException('Invalid refresh token');
    }
  }

  private sanitizeUser(user: User) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}