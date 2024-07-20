import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../const/role.enum';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  nickname!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
