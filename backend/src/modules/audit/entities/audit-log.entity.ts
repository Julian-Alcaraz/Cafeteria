import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column({ nullable: true })
  userId: number;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column({ type: 'jsonb', nullable: true })
  requestPayload: any;

  @Column({ type: 'jsonb', nullable: true })
  responsePayload: any;

  @Column()
  statusCode: number;

  @Column()
  isSuccess: boolean;

  @Column()
  executionTimeMs: number;
}
