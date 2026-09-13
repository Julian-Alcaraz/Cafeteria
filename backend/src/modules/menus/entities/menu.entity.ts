import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity.js';
import { BaseEntity } from '../../../common/entities/base.entity.js';

@Entity('menus')
export class Menu extends BaseEntity {

  @Column()
  label: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  parent_id: number;

  @ManyToOne(() => Menu, menu => menu.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Menu;

  @OneToMany(() => Menu, menu => menu.parent)
  children: Menu[];

  @ManyToOne(() => Permission, { nullable: true, eager: true })
  @JoinColumn({ name: 'permission_id' })
  requiredPermission: Permission;
}
