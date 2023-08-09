import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";

import { UserAuth } from "./UserAuth";

import File from "./File";
import Folder from "./Folder";
import Plan from "./plans";
import BankAccountPassword from "./BankAccountPassword";
import PlanActivity from "./planActivity";

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  stripeCustomer: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  storage: string;

  @Column({ nullable: true })
  storageLeft: string;

  @Column({ nullable: true })
  planTitle: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  profilePictureKey: string;

  @Column({ nullable: true })
  totalBuddies: string;

  @CreateDateColumn()
  dateJoined: Date;

  @OneToMany((type) => File, (file) => file.user)
  files: File[];

  @OneToMany((type) => Folder, (folder) => folder.user)
  folders: Folder[];

  @Column()
  verficationPeriod: string;

  @OneToOne(() => UserAuth, (userAuth) => userAuth.userProfile, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  userAuth: UserAuth;
}
