import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/guards/permissions.decorator.js';

@ApiTags('Audit Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('access_auditoria_log')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({ summary: 'Get audit logs with pagination and filters' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'method', required: false, type: String })
  @ApiQuery({ name: 'isSuccess', required: false, type: Boolean })
  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('method') method?: string,
    @Query('isSuccess') isSuccess?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const takeNum = take ? parseInt(take, 10) : 50;
    let isSuccessBool: boolean | undefined = undefined;
    
    if (isSuccess === 'true') isSuccessBool = true;
    else if (isSuccess === 'false') isSuccessBool = false;

    return this.auditService.findLogs({
      skip: skipNum,
      take: takeNum,
      method,
      isSuccess: isSuccessBool,
    });
  }
}
