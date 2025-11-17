import { ACodStatus } from 'src/a-cod-status/entities/a-cod-status.entity';
import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn,
} from 'typeorm';

@Entity('a_user')
export class AUser {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  Id: string;

  @ManyToOne(() => ACodStatus, { nullable: true, onUpdate: 'RESTRICT', onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'Status_Id', referencedColumnName: 'Id' })
  Status?: ACodStatus;

  @Column({ name: 'Status_Id', type: 'bigint', nullable: true })
  Status_Id?: string;

  @Column({ length: 100 }) F_Name: string;
  @Column({ length: 100 }) M_Name: string;
  @Column({ length: 100 }) L_Name: string;

  @Column({ length: 100, unique: true }) UserName: string;
  @Column({ length: 20, unique: true }) Phone_Number: string;

  @Column({ length: 255 }) Password: string;

  @Column({ type: 'text', nullable: true }) Rem?: string;

  @Column({ type: 'bigint', nullable: true }) Created_By?: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , }) Created_At?: Date;
  @Column({ type: 'bigint', nullable: true }) Updated_By?: string;
  @Column({   
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  }) Updated_At?: Date;
}
