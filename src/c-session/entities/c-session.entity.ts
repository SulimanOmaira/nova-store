import { C_Customer } from 'src/c-customer/entities/c-customer.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('c_session')
export class CSession {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  Id: string;

  @ManyToOne(() => C_Customer, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'User_Id', referencedColumnName: 'Id' })
  customer: C_Customer;

  @Column({ type: 'bigint' }) User_Id: string;

  @Column({ type: 'text' }) Access_Token: string;
  @Column({ type: 'text', nullable: true }) Refresh_Token?: string;
  @Column({ length: 500, nullable: true }) Device_Token?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  Created_At: Date;

  @Column({ type: 'timestamp', nullable: true })
  Expired_At?: Date;
}
