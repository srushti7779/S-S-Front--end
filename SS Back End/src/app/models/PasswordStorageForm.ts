import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
} from "typeorm";
import { UserAuth } from "./UserAuth";
import { UserProfile } from "./UserProfile";

@Entity()
class PasswordStorage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userProfileId" })
  userProfile: UserProfile;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  user_name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  account_nick_name: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default PasswordStorage;
