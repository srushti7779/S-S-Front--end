import { Response } from "express";
import { Request } from "../../../../utils/@types";
import BankAccountPassword from "../../../models/BankAccountPassword";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../../config";
import { UserAuth } from "../../../models/UserAuth";
import { UserProfile } from "../../../models/UserProfile";
import { Permission } from "../../../models/permissions";
import { PERMISSION_FORM_TYPE_ENUMS } from "../../../../utils/helper";

const BankAccountRepo = AppDataSource.getRepository(BankAccountPassword);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);
const PermissionRepo = AppDataSource.getRepository(Permission);

export const bankAccountController = {
  postBankAccount: async (req: Request, res: Response, next: any) => {
    try {
      const {
        bank_name,
        website,
        user_name,
        password,
        account_number,
        routing,
        account_nick_name,
      } = req.body;
      const requiredFields = [
        "bank_name",
        "website",
        "user_name",
        "password",
        "account_number",
        "routing",
        "account_nick_name",
      ];

      for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
          return res.status(400).send({
            code: 400,
            message: "Please fill all required fields " + requiredFields[i],
          });
        }
      }

      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      const newBankAccount = new BankAccountPassword();
      newBankAccount.userProfile = userProfile?.id as any;
      newBankAccount.bank_name = bank_name;
      newBankAccount.website = website;
      newBankAccount.user_name = user_name;
      newBankAccount.password = password;
      newBankAccount.account_number = account_number;
      newBankAccount.routing = routing;
      newBankAccount.account_nick_name = account_nick_name;

      await BankAccountRepo.save(newBankAccount);

      return res.status(200).json({
        message: "Account saved Successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getBankAccount: async (req: Request, res: Response, next: any) => {
    try {
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No Bank Account to display" });
      }

      const isHaveingPermission = await PermissionRepo.find({
        where: {
          buddy: { id: req.user as any },
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.BANK_ACCOUNT_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "bankAccountId"],
      });

      const allowedData = [];
      for (const bankPassword of isHaveingPermission) {
        allowedData.push(bankPassword.bankAccountId);
      }
      const isBankAccount = await BankAccountRepo.createQueryBuilder(
        "bankAccount"
      )
        .where("bankAccount.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .getMany();

      return res.status(200).send({
        message: "Success",
        data: isBankAccount,
        allowedData,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteBankAccount: async (req: Request, res: Response, next: any) => {
    try {
      const { id } = req.params;
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No Bank Account to display" });
      }
      const isBankAccount = await BankAccountRepo.createQueryBuilder(
        "bankAccount"
      )
        .innerJoin("bankAccount.userProfile", "userProfile")
        .where("bankAccount.id = :id", { id: id })
        .andWhere("userProfile.id = :userProfileId", {
          userProfileId: userProfile.id,
        })
        .getOne();

      if (!isBankAccount) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      await BankAccountRepo.delete({ id: parseInt(id) });

      return res.status(200).send({
        message: "Delete Successfull",
      });
    } catch (error) {
      next(error);
    }
  },

  renameBankAccount: async (req: Request, res: Response, next: any) => {
    try {
      if (!req.body.name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }
      const { id } = req.params;
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No Bank Account to display" });
      }

      const isBankAccount = await BankAccountRepo.createQueryBuilder(
        "bankAccount"
      )
        .where("bankAccount.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("bankAccount.id = :id", { id: id })
        .getOne();

      if (!isBankAccount) {
        return res.status(400).json({
          message: "No bank account attached",
        });
      }

      isBankAccount.name = req.body.name;

      BankAccountRepo.save(isBankAccount as any);

      return res.status(200).send({
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  getBankAccountDetailsById: async (req: Request, res: Response, next: any) => {
    try {
      const { id } = req.params;
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No Bank Account to display" });
      }

      const isHaveingPermission = await PermissionRepo.findOne({
        where: {
          bankAccountId: { id: id as any },
          buddy: { id: req.user as any },
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.BANK_ACCOUNT_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "bankAccountId"],
      });

      const isBankAccount = await BankAccountRepo.createQueryBuilder(
        "bankAccount"
      )
        .where("bankAccount.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("bankAccount.id = :id", { id: id })
        .getOne();

      if (!isBankAccount && !isHaveingPermission) {
        return res.status(400).json({
          message: "No bank account attached",
        });
      }

      return res.status(200).send({
        message: "Success",
        data: isBankAccount,
        allowedData: isHaveingPermission?.bankAccountId,
      });
    } catch (error) {
      next(error);
    }
  },

  updateBankAccountDetailsById: async (
    req: Request,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const requiredFields = [
        "bank_name",
        "website",
        "user_name",
        "password",
        "account_number",
        "routing",
        "account_nick_name",
      ];

      for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
          return res.status(400).send({
            code: 400,
            message: "Please fill all required fields " + requiredFields[i],
          });
        }
      }
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No Bank Account to display" });
      }

      const isBankAccount = await BankAccountRepo.createQueryBuilder(
        "bankAccount"
      )
        .where("bankAccount.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("bankAccount.id = :id", { id: id })
        .getOne();

      if (!isBankAccount) {
        return res.status(400).json({
          message: "No bank account attached",
        });
      }
      isBankAccount.bank_name = data?.bank_name;
      isBankAccount.website = data?.website;
      isBankAccount.user_name = data?.user_name;
      isBankAccount.password = data?.password;
      isBankAccount.account_number = data?.account_number;
      isBankAccount.account_nick_name = data?.account_nick_name;

      await BankAccountRepo.save(isBankAccount);

      return res.status(200).send({
        message: " Updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
