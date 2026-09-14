import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

@Entity('audit_ignore_rules')
export class AuditIgnoreRule extends BaseEntity {
  @Column({ unique: true })
  routePattern: string; // e.g., "/api/auth/login" or "/api/logs/*"

  @Column({ default: true })
  isActive: boolean;
}
