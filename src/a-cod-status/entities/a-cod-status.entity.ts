import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('a_cod_status')
export class ACodStatus {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  Id: string;

  @Column({ length: 100 })
  En_Name: string;

  @Column({ length: 100 })
  Ar_Name: string;

  @Column({ type: 'text', nullable: true })
  Rem?: string;
}
