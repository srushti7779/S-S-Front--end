import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { Admin } from "./admin";
import { UserProfile } from "./UserProfile";
import { UserAuth } from "./UserAuth";

@Entity()
class PlanActivity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  isPlanActive: boolean;

  @Column()
  title: string;

  @Column({ type: "float" })
  storage: number;

  @Column()
  buddies: number;

  @Column()
  priceMonthly: boolean;

  @Column()
  priceYearly: boolean;

  // One-to-one relationship with User entity
  @OneToOne(() => UserAuth, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn()
  user: UserAuth;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default PlanActivity;
