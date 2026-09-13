import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

@Entity('permissions')
export class Permission extends BaseEntity {

  @Column({ unique: true })
  name: string; // e.g., 'access_config', 'access_users_crud'

  @Column({ nullable: true })
  description: string;
}
