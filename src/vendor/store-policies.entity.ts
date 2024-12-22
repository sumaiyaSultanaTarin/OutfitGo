import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('store_policies')
export class StorePolicies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  return_policy: string;

  @Column({ nullable: true })
  shipping_terms: string;

  @OneToOne(() => Vendor, (vendor) => vendor.storePolicies)
  @JoinColumn()
  vendor: Vendor;
}
