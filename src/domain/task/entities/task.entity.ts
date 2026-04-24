import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ nullable: true })
  projectId: string;

  @Column({ nullable: true })
  parentTaskId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  taskNumber: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({ type: 'int', default: 0 })
  estimatedHours: number;

  @Column({ type: 'int', default: 0 })
  actualHours: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  assigneeId: string;

  @Column({ nullable: true })
  reporterId: string;

  @Column({ type: 'jsonb', nullable: true })
  labels: string[];

  @Column({ type: 'jsonb', nullable: true })
  attachments: Record<string, any>[];

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}