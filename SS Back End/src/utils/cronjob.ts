import { AppDataSource, transporter } from "../config";
import cron from "node-cron";
const interval = "*/10 * * * * *";
import moment from "moment";
import { Verification } from "../app/models/verification";
import { UserAuth } from "../app/models/UserAuth";
import { UserProfile } from "../app/models/UserProfile";
import { Permission } from "../app/models/permissions";
import Buddy from "../app/models/Buddies";
import File from "../app/models/File";
import Folder from "../app/models/Folder";
import BankAccountPassword from "../app/models/BankAccountPassword";
import LoanAccountPassword from "../app/models/LoanAccountPassword";
import MerchantAccountPassword from "../app/models/MerchantAccountPassword";
import CreditCardPassword from "../app/models/CreditCardPassword";
import MiscPasswordStorage from "../app/models/MiscPasswordForm";
import PasswordStorage from "../app/models/PasswordStorageForm";
import RecipeForm from "../app/models/RecipeForm";

const VerificationRepo = AppDataSource.getRepository(Verification);
const UserAuthRepo = AppDataSource.getRepository(UserAuth);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);
const PermissionRepo = AppDataSource.getRepository(Permission);
const BuddiesRepo = AppDataSource.getRepository(Buddy);
const FileRepo = AppDataSource.getRepository(File);
const FolderRepo = AppDataSource.getRepository(Folder);
const BankAccountRepo = AppDataSource.getRepository(BankAccountPassword);
const LoanAccountRepo = AppDataSource.getRepository(LoanAccountPassword);
const MerchantAccountRepo = AppDataSource.getRepository(
  MerchantAccountPassword
);
const CreditCardRepo = AppDataSource.getRepository(CreditCardPassword);
const MiscPasswordRepo = AppDataSource.getRepository(MiscPasswordStorage);
const PasswordStorageRepo = AppDataSource.getRepository(PasswordStorage);
const RecipeRepo = AppDataSource.getRepository(RecipeForm);

const sendEmail = async (row: any) => {
  const mailOptions = {
    from: "smtp@gmail.com",
    to: row.email,
    subject: "Verification Email",
    html: `
      <p>Please click the button below to verify your email:</p>
      <a href="${process.env.CLIENT_URL}/home/verify-user">Verify Email</a>
    `,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
    } else {
      const verificationData = await VerificationRepo.findOne({
        where: {
          userAuth: { id: row.userAuth.id },
        },
        relations: ["userAuth"],
      });

      const newReponse: any = {
        ...verificationData,
        verification_status: false,
        email_sent_for_verification: true,
        email_sent_date: moment(),
        email_sent_expire_date: moment().add(1, "day"),
      };
      await VerificationRepo.save(newReponse);
    }
  });
};

const checkVerificationStatus = async () => {
  try {
    const getAllVerification = await VerificationRepo.find({
      relations: ["userAuth"],
    });
    for (const row of getAllVerification) {
      if (
        moment(row.dateJoined, "DD/MM/YYYY")
          .add(row.verficationPeriod, "days")
          .isBefore(moment(), "day")
      ) {
        if (row.email_sent_for_verification) {
          if (
            moment(moment(), "DD/MM/YYYY").isAfter(
              moment(row.email_sent_expire_date, "DD/MM/YYYY"),
              "day"
            )
          ) {
            const getSubPrimeBuddy = await BuddiesRepo.findOne({
              where: {
                user: { id: row.userAuth.id },
                buddyType: "subprime",
              },
              relations: ["user", "buddy"],
            });
            const getProfileOfUser = await UserProfileRepo.findOne({
              where: {
                userAuth: { id: row.userAuth.id },
              },
              relations: ["userAuth"],
            });
            const getUserProfileIdWithBuddyId = await UserProfileRepo.findOne({
              where: {
                userAuth: { id: getSubPrimeBuddy?.buddy.id },
              },
            });

            const getAllFiles = await FileRepo.find({
              where: {
                user: { id: getProfileOfUser?.id },
              },
              relations: ["user"],
            });

            for (const file of getAllFiles) {
              file.user = getUserProfileIdWithBuddyId as any;
              await FileRepo.save(file);
            }

            const getAllFolders = await FolderRepo.find({
              where: {
                user: { id: getProfileOfUser?.id },
              },
              relations: ["user"],
            });

            for (const folder of getAllFolders) {
              folder.user = getUserProfileIdWithBuddyId as any;
              FolderRepo.save(folder);
            }

            const getAllBankAccount = await BankAccountRepo.find({
              where: {
                userProfile: { id: getProfileOfUser?.id },
              },
              relations: ["userProfile"],
            });

            for (const bankAccount of getAllBankAccount) {
              bankAccount.userProfile = getUserProfileIdWithBuddyId as any;
              await BankAccountRepo.save(bankAccount);
            }

            const getAllLoanAccount = await LoanAccountRepo.find({
              where: {
                userProfile: { id: getProfileOfUser?.id },
              },
              relations: ["userProfile"],
            });

            for (const loanAccount of getAllLoanAccount) {
              loanAccount.userProfile = getUserProfileIdWithBuddyId as any;
              await LoanAccountRepo.save(loanAccount);
            }

            const getAllMerchantAccount = await MerchantAccountRepo.find({
              where: {
                userProfile: { id: getProfileOfUser?.id },
              },
              relations: ["userProfile"],
            });

            for (const merchantAccount of getAllMerchantAccount) {
              merchantAccount.userProfile = getUserProfileIdWithBuddyId as any;
              await MerchantAccountRepo.save(merchantAccount);
            }

            const getAllMiscPassword = await MiscPasswordRepo.find({
              where: {
                userProfile: { id: getProfileOfUser?.id },
              },
              relations: ["userProfile"],
            });

            for (const miscPassword of getAllMiscPassword) {
              miscPassword.userProfile = getUserProfileIdWithBuddyId as any;
              await MiscPasswordRepo.save(miscPassword);
            }

            const getAllCreditCard = await CreditCardRepo.find({
              where: {
                userProfile: { id: getProfileOfUser?.id },
              },
              relations: ["userProfile"],
            });

            for (const creditCard of getAllCreditCard) {
              creditCard.userProfile = getUserProfileIdWithBuddyId as any;
              await CreditCardRepo.save(creditCard);
            }

            const getAllPasswordStorage = await PasswordStorageRepo.find({
              where: {
                userProfile: { id: getProfileOfUser?.id },
              },
              relations: ["userProfile"],
            });

            for (const passWordStorage of getAllPasswordStorage) {
              passWordStorage.userProfile = getUserProfileIdWithBuddyId as any;
              await PasswordStorageRepo.save(passWordStorage);
            }

            const getAllRecipe = await RecipeRepo.find({
              where: {
                userProfile: { id: getProfileOfUser?.id },
              },
              relations: ["userProfile"],
            });

            for (const recipe of getAllRecipe) {
              recipe.userProfile = getUserProfileIdWithBuddyId as any;
              await RecipeRepo.save(recipe);
            }

            await VerificationRepo.delete({
              email: row.email,
            });
            await UserProfileRepo.delete({
              id: getProfileOfUser?.id,
            });
            await UserAuthRepo.delete({
              id: row.userAuth.id,
            });
          }
        } else {
          console.log(`Send mail to ${row.email}`);
          sendEmail(row);
        }
      } else {
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const scheduleCronJob = async () => {
  checkVerificationStatus();
};
