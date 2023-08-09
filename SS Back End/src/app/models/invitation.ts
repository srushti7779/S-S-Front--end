import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { UserAuth } from "./UserAuth";

@Entity()
class BuddyInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UserAuth, { onDelete: "CASCADE" })
  user: UserAuth;

  @Column()
  buddy: string;

  @Column()
  relationshipStatus: string;

  @Column()
  buddyType: string;

  @Column()
  buddyStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default BuddyInvitation;
