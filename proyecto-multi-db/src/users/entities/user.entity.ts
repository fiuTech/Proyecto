import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 200, nullable: true })
  fullname: string | null;

  @Column({ length: 255, nullable: true })
  email: string | null;

  @Column({ length: 20, nullable: true })
  phone: string | null; 

  @Column({ length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}