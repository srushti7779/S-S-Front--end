import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
} from "typeorm";
import { UserProfile } from "./UserProfile";
import BankAccountPassword from "./BankAccountPassword";
import CreditCardPassword from "./CreditCardPassword";
import LoanAccountPassword from "./LoanAccountPassword";
import MerchantAccountPassword from "./MerchantAccountPassword";
import MiscPasswordStorage from "./MiscPasswordForm";
import PasswordStorage from "./PasswordStorageForm";
import RecipeForm from "./RecipeForm";
import File from "./File";
import Buddy from "./Buddies";
import { UserAuth } from "./UserAuth";
import Folder from "./Folder";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserAuth, (userAuth) => userAuth.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userAuth" })
  userAuth: UserAuth;

  @ManyToOne(() => File, (file) => file.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "fileId" })
  file: File;

  @ManyToOne(() => Folder, (folder) => folder.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "folderId" })
  folder: Folder;

  @ManyToOne(() => BankAccountPassword, (bank) => bank.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "bankAccountId" })
  bankAccountId: BankAccountPassword;

  @ManyToOne(() => CreditCardPassword, (creditCard) => creditCard.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "creditCardId" })
  creditCardId: CreditCardPassword;

  @ManyToOne(() => LoanAccountPassword, (loan) => loan.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "loanAccountId" })
  loanAccountId: LoanAccountPassword;

  @ManyToOne(() => MerchantAccountPassword, (merchant) => merchant.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "merchantAccountId" })
  merchantAccountId: MerchantAccountPassword;

  @ManyToOne(() => PasswordStorage, (password) => password.id, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "passwordStorageId" })
  passwordStorageId: PasswordStorage;

  @ManyToOne(() => MiscPasswordStorage, (misc) => misc.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "miscAccountId" })
  miscAccountId: MiscPasswordStorage;

  @ManyToOne(() => RecipeForm, (recipe) => recipe.id, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "recipeAccountId" })
  recipeAccountId: RecipeForm;

  @ManyToOne(() => UserAuth, (userAuth) => userAuth.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "buddyId" })
  buddy: UserAuth;

  @Column({ nullable: true })
  form_type: string;

  @Column({ default: false })
  canRead: boolean;

  @Column({ default: false })
  canWrite: boolean;

  @Column({ default: false })
  canShare: boolean;

  @Column({ nullable: true })
  timeReleaseDate: boolean;

  @Column({ nullable: true })
  instantReleaseDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
