import { Response } from "express";
import { Request } from "../../../../utils/@types";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../../config";
import { UserProfile } from "../../../models/UserProfile";
import MerchantAccountPassword from "../../../models/MerchantAccountPassword";
import { Permission } from "../../../models/permissions";
import { PERMISSION_FORM_TYPE_ENUMS } from "../../../../utils/helper";

const MerchantAccountPasswordRepo = AppDataSource.getRepository(
  MerchantAccountPassword
);
const PermissionRepo = AppDataSource.getRepository(Permission);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);

export const merchantAccountController = {
  postMerchantAccount: async (req: Request, res: Response, next: any) => {
    try {
      const {
        merchant_name,
        website,
        user_name,
        password,
        account_number,
        account_nick_name,
      } = req.body;
      const requiredFields = [
        "merchant_name",
        "website",
        "user_name",
        "password",
        "account_number",
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

      const newLoanAccount = new MerchantAccountPassword();
      newLoanAccount.userProfile = userProfile?.id as any;
      newLoanAccount.merchant_name = merchant_name;
      newLoanAccount.website = website;
      newLoanAccount.user_name = user_name;
      newLoanAccount.password = password;
      newLoanAccount.account_number = account_number;
      newLoanAccount.account_nick_name = account_nick_name;

      await MerchantAccountPasswordRepo.save(newLoanAccount);

      return res.status(200).json({
        message: "Merchant Account saved Successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getMerchantAccount: async (req: Request, res: Response, next: any) => {
    try {
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res.status(200).json({
          success: false,
          message: "No merchant account forms to display",
        });
      }

      const isMerchantAccount =
        await MerchantAccountPasswordRepo.createQueryBuilder("merchantAccount")
          .where("merchantAccount.userProfile = :userProfile", {
            userProfile: userProfile?.id,
          })
          .getMany();

      const isHaveingPermission = await PermissionRepo.find({
        where: {
          buddy: { id: req.user as any },
          timeReleaseDate: false,
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.MERCHANT_ACCOUNT_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "merchantAccountId"],
      });
      const allowedData = [];
      for (const merchantAccount of isHaveingPermission) {
        allowedData.push(merchantAccount.merchantAccountId);
      }

      if (!isMerchantAccount && isHaveingPermission.length < 0) {
        return res.status(400).json({
          message: "No merchant account forms attached",
        });
      }

      return res.status(200).send({
        message: "Success",
        data: isMerchantAccount,
        allowedData,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteMerchantAccount: async (req: Request, res: Response, next: any) => {
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
      const isMerchantAccount =
        await MerchantAccountPasswordRepo.createQueryBuilder("merchantAccount")
          .innerJoin("merchantAccount.userProfile", "userProfile")
          .where("merchantAccount.id = :id", { id: id })
          .andWhere("userProfile.id = :userProfileId", {
            userProfileId: userProfile.id,
          })
          .getOne();

      if (!isMerchantAccount) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      await MerchantAccountPasswordRepo.delete({ id: parseInt(id) });

      return res.status(200).send({
        message: "Delete Successfull",
      });
    } catch (error) {
      next(error);
    }
  },

  renameMerchantAccount: async (req: Request, res: Response, next: any) => {
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
          .json({ success: false, message: "No Credit Card to display" });
      }

      const isMerchantAccount =
        await MerchantAccountPasswordRepo.createQueryBuilder("merchantAccount")
          .innerJoin("merchantAccount.userProfile", "userProfile")
          .where("merchantAccount.id = :id", { id: id })
          .andWhere("userProfile.id = :userProfileId", {
            userProfileId: userProfile.id,
          })
          .getOne();

      if (!isMerchantAccount) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      isMerchantAccount.name = req.body.name;

      MerchantAccountPasswordRepo.save(isMerchantAccount as any);

      return res.status(200).send({
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  getMerchantAccountDetailsById: async (
    req: Request,
    res: Response,
    next: any
  ) => {
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

      const isMerchantAccount =
        await MerchantAccountPasswordRepo.createQueryBuilder("merchantAccount")
          .where("merchantAccount.userProfile = :userProfile", {
            userProfile: userProfile?.id,
          })
          .andWhere("merchantAccount.id = :id", { id: id })
          .getOne();

      const isHaveingPermission = await PermissionRepo.findOne({
        where: {
          merchantAccountId: { id: id as any },
          buddy: { id: req.user as any },
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.MERCHANT_ACCOUNT_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "merchantAccountId"],
      });

      if (!isMerchantAccount && !isHaveingPermission) {
        return res.status(400).json({
          message: "No data found",
        });
      }

      return res.status(200).send({
        message: "Success",
        allowedData: isHaveingPermission?.merchantAccountId,
        data: isMerchantAccount,
      });
    } catch (error) {
      next(error);
    }
  },

  updateMerchantAccountDetailsById: async (
    req: Request,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const requiredFields = [
        "merchant_name",
        "website",
        "user_name",
        "password",
        "account_number",
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
          .json({ success: false, message: "No data found" });
      }

      const isMerchantAccount =
        await MerchantAccountPasswordRepo.createQueryBuilder("merchantAccount")
          .where("merchantAccount.userProfile = :userProfile", {
            userProfile: userProfile?.id,
          })
          .andWhere("merchantAccount.id = :id", { id: id })
          .getOne();

      if (!isMerchantAccount) {
        return res.status(400).json({
          message: "No data found",
        });
      }
      isMerchantAccount.merchant_name = data?.merchant_name;
      isMerchantAccount.website = data?.website;
      isMerchantAccount.user_name = data?.user_name;
      isMerchantAccount.password = data?.password;
      isMerchantAccount.account_number = data?.account_number;
      isMerchantAccount.account_nick_name = data?.account_nick_name;

      await MerchantAccountPasswordRepo.save(isMerchantAccount);

      return res.status(200).send({
        message: " Updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
