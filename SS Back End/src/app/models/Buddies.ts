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
class Buddy {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => UserAuth, { onDelete: "CASCADE" })
  user: UserAuth;

  @ManyToOne((type) => UserAuth)
  buddy: UserAuth;

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

export default Buddy;
