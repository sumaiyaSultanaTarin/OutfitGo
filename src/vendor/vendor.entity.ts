import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { StorePolicies } from './store-policies.entity';
import { PaymentInfo } from './payment-info.entity';
import { Product } from 'src/Product/product.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Profile, (profile) => profile.vendor, { cascade: true })
  profile: Profile;

  @OneToOne(() => StorePolicies, (storePolicy) => storePolicy.vendor)
  storePolicies: StorePolicies;

  @OneToOne(() => PaymentInfo, (paymentInfo) => paymentInfo.vendor)
  paymentInfo: PaymentInfo;



}
