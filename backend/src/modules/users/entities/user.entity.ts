import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  apellido: string;


  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({
    name: 'user_permissions',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
