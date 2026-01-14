import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AUser } from 'src/a-user/entities/a-user.entity';
import { C_Customer } from 'src/c-customer/entities/c-customer.entity';

export enum ComplaintStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum ComplaintPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('c_complaint')
export class Complaint {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  Id: string;

  // ---------- CUSTOMER ----------
  @Column({ name: 'Customer_Id', type: 'bigint' })
  Customer_Id: string;

  @ManyToOne(() => C_Customer, { onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'Customer_Id', referencedColumnName: 'Id' })
  Customer: C_Customer;

  // ---------- (optional) STORE for easier filtering ----------
  @Column({ name: 'store_id', type: 'int', nullable: true })
  storeId?: number;

  // ---------- ADMIN ASSIGNEE (optional) ----------
  @Column({ name: 'Assigned_Admin_Id', type: 'bigint', nullable: true })
  Assigned_Admin_Id?: string;

  @ManyToOne(() => AUser, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'Assigned_Admin_Id', referencedColumnName: 'Id' })
  AssignedAdmin?: AUser;

  // ---------- CONTENT ----------
  @Column({ length: 150 })
  Subject: string;

  @Column({ type: 'text' })
  Description: string;

  // ---------- STATE ----------
  @Column({ type: 'varchar', length: 20, default: ComplaintStatus.OPEN })
  Status: ComplaintStatus;

  @Column({ type: 'varchar', length: 10, default: ComplaintPriority.MEDIUM })
  Priority: ComplaintPriority;

  // ---------- AUDIT ----------
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  Created_At: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  Updated_At: Date;

  @Column({ type: 'timestamp', nullable: true })
  Closed_At: Date | null;
}
