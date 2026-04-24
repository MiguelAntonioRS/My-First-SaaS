import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { SubscriptionStatus } from './subscription-status.enum';

export enum SubscriptionInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  plan: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ type: 'decimal' })
  price: number;

  @Column()
  currency: string;

  @Column({
    type: 'enum',
    enum: SubscriptionInterval,
    default: SubscriptionInterval.MONTHLY,
  })
  interval: SubscriptionInterval;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column()
  subscriptionId: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  stripeInvoiceId: string;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}