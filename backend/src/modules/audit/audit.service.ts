import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity.js';
import { AuditIgnoreRule } from './entities/audit-ignore-rule.entity.js';
import { CreateAuditIgnoreRuleDto, UpdateAuditIgnoreRuleDto } from './dto/audit-ignore-rule.dto.js';

@Injectable()
export class AuditService implements OnModuleInit {
  private ignoredRoutesCache: string[] = [];

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    @InjectRepository(AuditIgnoreRule)
    private readonly auditIgnoreRuleRepository: Repository<AuditIgnoreRule>,
  ) {}

  async onModuleInit() {
    await this.refreshIgnoredRoutesCache();
  }

  private async refreshIgnoredRoutesCache() {
    const rules = await this.auditIgnoreRuleRepository.find({ where: { isActive: true, deshabilitado: false } });
    this.ignoredRoutesCache = rules.map(rule => rule.routePattern);
  }

  isRouteIgnored(url: string): boolean {
    return this.ignoredRoutesCache.some(pattern => {
      // Basic wildcard matching (e.g., "/api/auth/*")
      if (pattern.endsWith('*')) {
        const base = pattern.slice(0, -1);
        return url.startsWith(base);
      }
      return url === pattern;
    });
  }

  maskSensitiveData(payload: any): any {
    if (!payload || typeof payload !== 'object') return payload;
    
    // Deep clone to avoid mutating the original request/response
    const masked = JSON.parse(JSON.stringify(payload));
    
    const maskRecursively = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          maskRecursively(obj[key]);
        } else if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
          obj[key] = '***MASKED***';
        }
      }
    };
    
    maskRecursively(masked);
    return masked;
  }

  async createLogAsync(data: Partial<AuditLog>): Promise<void> {
    if (!data.url || this.isRouteIgnored(data.url)) {
      return;
    }

    try {
      const log = this.auditLogRepository.create({
        ...data,
        requestPayload: this.maskSensitiveData(data.requestPayload),
        responsePayload: this.maskSensitiveData(data.responsePayload),
      });
      await this.auditLogRepository.save(log);
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  }

  // --- ABM for AuditIgnoreRules ---

  async findAllRules(): Promise<AuditIgnoreRule[]> {
    return this.auditIgnoreRuleRepository.find({ where: { deshabilitado: false } });
  }

  async createRule(dto: CreateAuditIgnoreRuleDto): Promise<AuditIgnoreRule> {
    const rule = this.auditIgnoreRuleRepository.create(dto);
    const saved = await this.auditIgnoreRuleRepository.save(rule);
    await this.refreshIgnoredRoutesCache();
    return saved;
  }

  async updateRule(id: number, dto: UpdateAuditIgnoreRuleDto): Promise<AuditIgnoreRule | null> {
    await this.auditIgnoreRuleRepository.update(id, dto);
    const updated = await this.auditIgnoreRuleRepository.findOne({ where: { id } });
    await this.refreshIgnoredRoutesCache();
    return updated;
  }

  async removeRule(id: number): Promise<void> {
    await this.auditIgnoreRuleRepository.update(id, { deshabilitado: true });
    await this.refreshIgnoredRoutesCache();
  }

  // --- Audit Logs Retrieval (Pagination & Filtering) ---
  
  async findLogs(query: { skip?: number; take?: number; method?: string; isSuccess?: boolean }) {
    const { skip = 0, take = 50, method, isSuccess } = query;
    
    const where: any = { deshabilitado: false };
    if (method) {
      where.method = method;
    }
    if (isSuccess !== undefined) {
      where.isSuccess = isSuccess;
    }

    const [items, total] = await this.auditLogRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' }, // Desde los más nuevos a los más antiguos
      skip,
      take,
    });

    return { items, total, skip, take };
  }
}
