import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { UserAuth } from "./UserAuth";
import { UserProfile } from "./UserProfile";

@Entity()
class BankAccountPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userProfileId" })
  userProfile: UserProfile;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  user_name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  account_number: string;

  @Column({ nullable: true })
  routing: string;

  @Column({ nullable: true })
  account_nick_name: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default BankAccountPassword;
