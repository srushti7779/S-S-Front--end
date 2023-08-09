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
class RecipeForm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserProfile, (userProfile) => userProfile.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userProfileId" })
  userProfile: UserProfile;

  @Column({ nullable: true })
  recipe_name: string;

  @Column({ nullable: true })
  ingredient_one: string;

  @Column({ nullable: true })
  ingredient_one_amount: string;

  @Column({ nullable: true })
  ingredient_one_amount_type: string;

  @Column({ nullable: true })
  ingredient_two: string;

  @Column({ nullable: true })
  ingredient_two_amount: string;

  @Column({ nullable: true })
  ingredient_two_amount_type: string;

  @Column({ nullable: true })
  ingredient_three: string;

  @Column({ nullable: true })
  ingredient_three_amount: string;

  @Column({ nullable: true })
  ingredient_three_amount_type: string;

  @Column({ nullable: true })
  ingredient_four: string;

  @Column({ nullable: true })
  ingredient_four_amount: string;

  @Column({ nullable: true })
  ingredient_four_amount_type: string;

  @Column({ nullable: true })
  ingredient_five: string;

  @Column({ nullable: true })
  ingredient_five_amount: string;

  @Column({ nullable: true })
  ingredient_five_amount_type: string;

  @Column({ nullable: true })
  ingredient_six: string;

  @Column({ nullable: true })
  ingredient_six_amount: string;

  @Column({ nullable: true })
  ingredient_six_amount_type: string;

  @Column({ nullable: true })
  ingredient_seven: string;

  @Column({ nullable: true })
  ingredient_seven_amount: string;

  @Column({ nullable: true })
  ingredient_seven_amount_type: string;

  @Column({ nullable: true })
  cooking_description: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default RecipeForm;
