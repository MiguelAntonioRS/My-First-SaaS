import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { Role } from '../../domain/user/entities/role.entity';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { AuthInfrastructureModule } from '../../infrastructure/authentication/auth.module';
import { JwtStrategy } from '../../infrastructure/authentication/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), AuthInfrastructureModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy],
  exports: [UserService, UserRepository],
})
export class UserModule {}