import { ACodLang } from 'src/a-cod-lang/entities/a-cod-lang.entity';
import { ACodStatus } from 'src/a-cod-status/entities/a-cod-status.entity';
import { CustomerTransaction } from 'src/sync/entities/customer-transaction.entity';
import { Invoice } from 'src/sync/entities/invoice.entity';
import { Store } from 'src/sync/entities/store.entity';
import { UCodCity } from 'src/u-cod-city/entities/u-cod-city.entity';
import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn,
  OneToMany,
} from 'typeorm';


@Entity('c_customer')
export class Customer {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  Id: string;

  @ManyToOne(() => ACodStatus, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'Status_Id', referencedColumnName: 'Id' })
  Status?: ACodStatus;

  @Column({ type: 'bigint', nullable: true, name: 'Status_Id' }) Status_Id?: string;

  @ManyToOne(() => UCodCity, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'City_Id', referencedColumnName: 'Id' })
  City?: UCodCity;

  @Column({ type: 'bigint', nullable: true, name: 'City_Id' }) City_Id?: string;

  @ManyToOne(() => ACodLang, { nullable: true, onDelete: 'RESTRICT', onUpdate: 'RESTRICT' })
  @JoinColumn({ name: 'Lang_Id', referencedColumnName: 'Id' })
  Lang?: ACodLang;

  @Column({ type: 'bigint', nullable: true, name: 'Lang_Id' }) Lang_Id?: string;

  @Column({ length: 100 }) F_Name: string;
  @Column({ length: 100, nullable: true }) M_Name?: string;
  @Column({ length: 100 }) L_Name: string;

  @Column({ length: 255, unique: true, nullable: true }) Username?: string;
  @Column({ length: 100 }) Adress: string;
  @Column({ length: 20, unique: true }) Phone_Number: string;

  @Column({ length: 255 }) Password: string;

  @Column({ type: 'text', nullable: true }) Image_Base64?: string;

  @Column({ length: 100, nullable: true }) Rem?: string;

  @Column({ type: 'bigint', nullable: true }) Created_By?: string;
  @Column({ type: 'timestamp', nullable: true }) Created_At?: Date;
  @Column({ type: 'bigint', nullable: true }) Updated_By?: string;
  @Column({ name : 'updated_at',type: 'timestamp', nullable: true }) Updated_At?: Date;
  @Column({ type: 'boolean', default: false }) isDeleted: boolean;
  
  @Column({ type: 'uuid', name: 'store_id' })
  storeId: string;

    @ManyToOne(() => Store, (store) => store.customers, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })

    @JoinColumn({ name: 'store_id' })
  store: Store;
  
  @OneToMany(() => CustomerTransaction, (t) => t.customer)
  transactions: CustomerTransaction[];

  @OneToMany(() => Invoice, (i) => i.customer)
invoices: Invoice[];
}
