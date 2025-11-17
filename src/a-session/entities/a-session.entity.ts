import { AUser } from 'src/a-user/entities/a-user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('a_session')
export class ASession {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  Id: string;

  @ManyToOne(() => AUser, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'User_Id', referencedColumnName: 'Id' })
  user: AUser;

  @Column({ type: 'bigint' }) User_Id: string;

  @Column({ type: 'text' }) Token: string;
  @Column({ length: 500, nullable: true }) Device_Token?: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) Created_At: Date;
  @Column({ type: 'timestamp', nullable: true }) Expired_At?: Date;
}
