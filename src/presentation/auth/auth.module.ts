import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../domain/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthInfrastructureModule } from '../../infrastructure/authentication/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthInfrastructureModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthPresentationModule {}