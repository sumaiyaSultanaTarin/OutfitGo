import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('payment_info')
export class PaymentInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bank_account: string;

  @Column({ nullable: true })
  email: string;

  @OneToOne(() => Vendor, (vendor) => vendor.paymentInfo)
  @JoinColumn()
  vendor: Vendor;
}
