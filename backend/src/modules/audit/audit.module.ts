import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module.js';
import { AuditService } from './audit.service.js';
import { AuditController } from './audit.controller.js';
import { AuditLogsController } from './audit-logs.controller.js';
import { AuditLog } from './entities/audit-log.entity.js';
import { AuditIgnoreRule } from './entities/audit-ignore-rule.entity.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog, AuditIgnoreRule]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule
  ],
  controllers: [AuditController, AuditLogsController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
