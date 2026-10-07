import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

@Entity('suppliers')
export class Supplier extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  taxId: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;
}
