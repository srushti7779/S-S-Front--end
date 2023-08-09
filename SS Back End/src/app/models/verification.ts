import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import BankAccountPassword from "./BankAccountPassword";
import { UserAuth } from "./UserAuth";

@Entity()
export class Verification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  verification_status: boolean;

  @Column({ default: false })
  email_sent_for_verification: boolean;

  @Column({ nullable: true })
  email_sent_date: Date;

  @Column({ nullable: true })
  email_sent_expire_date: Date;

  @CreateDateColumn()
  dateJoined: Date;

  @Column()
  verficationPeriod: string;

  @OneToOne(() => UserAuth, (userAuth) => userAuth.verificationId)
  @JoinColumn()
  userAuth: UserAuth;
}
