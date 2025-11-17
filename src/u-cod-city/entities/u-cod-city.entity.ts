import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('U_Cod_City')
export class UCodCity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  Id: string;

  @Column({ length: 100 }) En_Name: string;
  @Column({ length: 100 }) Ar_Name: string;
  @Column({ type: 'text', nullable: true }) Rem?: string;

  @Column({ type: 'bigint', nullable: true }) Created_By?: string;
  @Column({ type: 'timestamp', nullable: true }) Created_At?: Date;
  @Column({ type: 'bigint', nullable: true }) Updated_By?: string;
  @Column({ type: 'timestamp', nullable: true }) Updated_At?: Date;
}
