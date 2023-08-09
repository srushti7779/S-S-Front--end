import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { Admin } from "./admin";
import { UserProfile } from "./UserProfile";

@Entity("plans")
class Plan {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "float" })
  storage: number;

  @Column()
  buddies: number;

  @Column({ type: "float" })
  priceMonthly: number;

  @Column({ type: "float" })
  priceYearly: number;

  @Column({ type: "float" })
  discount: number;

  @Column()
  description: string;

  @ManyToOne((type) => Admin)
  addedBy: Admin;

  @Column({ type: "float" })
  fileSizeLimit: number;

  @Column()
  files: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Plan;
