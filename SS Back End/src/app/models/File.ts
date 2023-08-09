import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { UserProfile } from "./UserProfile";
import Folder from "./Folder";

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ext: string;

  @Column({ nullable: true })
  mime_type: string;

  @Column()
  size: string;

  @Column({ nullable: true })
  path: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  key: string;

  @ManyToOne((type) => Folder, (folder) => folder.files, {
    onDelete: "CASCADE",
  })
  folder: Folder;

  @ManyToOne((type) => UserProfile, (user) => user.files, {
    onDelete: "CASCADE",
  })
  user: UserProfile;

  @Column({ nullable: true })
  fileName: string;
}

export default File;
