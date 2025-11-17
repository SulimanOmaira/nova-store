import { CCustomer } from 'src/c-customer/entities/c-customer.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('C_Session')
export class CSession {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  Id: string;

  @ManyToOne(() => CCustomer, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'User_Id', referencedColumnName: 'Id' })
  customer: CCustomer;

  @Column({ type: 'bigint' }) User_Id: string;

  @Column({ type: 'longtext' }) Access_Token: string;
  @Column({ type: 'longtext', nullable: true }) Refresh_Token?: string;
  @Column({ length: 500, nullable: true }) Device_Token?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  Created_At: Date;

  @Column({ type: 'timestamp', nullable: true })
  Expired_At?: Date;
}
