import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Vendor } from './vendor.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  business_name: string;

  @Column({ nullable: true })
  contact_info: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  banner_url: string;

  @OneToOne(() => Vendor, (vendor) => vendor.profile)
  @JoinColumn()
  vendor: Vendor;
}
