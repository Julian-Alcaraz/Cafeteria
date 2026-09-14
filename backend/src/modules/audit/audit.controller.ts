import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service.js';
import { CreateAuditIgnoreRuleDto, UpdateAuditIgnoreRuleDto } from './dto/audit-ignore-rule.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/guards/permissions.decorator.js';

@ApiTags('Audit Ignore Rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('access_auditoria_rules')
@Controller('audit-ignore-rules')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({ summary: 'Get all active audit ignore rules' })
  @Get()
  findAll() {
    return this.auditService.findAllRules();
  }

  @ApiOperation({ summary: 'Create a new audit ignore rule' })
  @Post()
  create(@Body() createDto: CreateAuditIgnoreRuleDto) {
    return this.auditService.createRule(createDto);
  }

  @ApiOperation({ summary: 'Update an audit ignore rule' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAuditIgnoreRuleDto) {
    return this.auditService.updateRule(+id, updateDto);
  }

  @ApiOperation({ summary: 'Soft delete an audit ignore rule' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auditService.removeRule(+id);
  }
}
