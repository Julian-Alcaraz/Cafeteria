import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { User } from '../users/entities/user.entity.js';
import { Menu } from '../menus/entities/menu.entity.js';
import { Permission } from '../permissions/entities/permission.entity.js';
import * as fs from 'fs';
import * as path from 'path';

const privateKey = fs.readFileSync(path.join(process.cwd(), 'keys/jwtRS256.key'), 'utf8');
const publicKey = fs.readFileSync(path.join(process.cwd(), 'keys/jwtRS256.key.pub'), 'utf8');

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Menu, Permission]),
    PassportModule,
    JwtModule.register({
      privateKey: privateKey,
      publicKey: publicKey,
      signOptions: { expiresIn: '8h', algorithm: 'RS256' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
