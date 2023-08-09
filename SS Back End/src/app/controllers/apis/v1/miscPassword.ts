import { Response } from "express";
import { Request } from "../../../../utils/@types";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../../config";
import { UserProfile } from "../../../models/UserProfile";
import MiscPasswordStorage from "../../../models/MiscPasswordForm";
import { Permission } from "../../../models/permissions";
import { PERMISSION_FORM_TYPE_ENUMS } from "../../../../utils/helper";

const MiscPasswordRepo = AppDataSource.getRepository(MiscPasswordStorage);
const PermissionRepo = AppDataSource.getRepository(Permission);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);

export const miscPasswordController = {
  postMiscPassword: async (req: Request, res: Response, next: any) => {
    try {
      const {
        account_name,
        website,
        user_name,
        password,
        account_number,
        account_nick_name,
      } = req.body;
      const requiredFields = [
        "account_name",
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

      const newMiscPassword = new MiscPasswordStorage();
      newMiscPassword.userProfile = userProfile?.id as any;
      newMiscPassword.account_name = account_name;
      newMiscPassword.website = website;
      newMiscPassword.user_name = user_name;
      newMiscPassword.password = password;
      newMiscPassword.account_number = account_number;
      newMiscPassword.account_nick_name = account_nick_name;

      await MiscPasswordRepo.save(newMiscPassword);

      return res.status(200).json({
        message: "Saved Successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getMiscPassword: async (req: Request, res: Response, next: any) => {
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
          message: "No misc Password forms to display",
        });
      }
      const isMiscPassword = await MiscPasswordRepo.createQueryBuilder(
        "miscPassword"
      )
        .where("miscPassword.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .getMany();

      const isHaveingPermission = await PermissionRepo.find({
        where: {
          buddy: { id: req.user as any },
          timeReleaseDate: false,
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.MISC_PASSWORD_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "miscAccountId"],
      });
      const allowedData = [];
      for (const miscAccount of isHaveingPermission) {
        allowedData.push(miscAccount.miscAccountId);
      }

      if (!isMiscPassword && isHaveingPermission.length < 0) {
        return res.status(400).json({
          message: "No misc Password forms attached",
        });
      }

      return res.status(200).send({
        message: "Success",
        data: isMiscPassword,
        allowedData,
      });
    } catch (error) {
      next(error);
    }
  },

  renameMiscAccount: async (req: Request, res: Response, next: any) => {
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

      const isMiscPassword = await MiscPasswordRepo.createQueryBuilder(
        "miscPassword"
      )
        .innerJoin("miscPassword.userProfile", "userProfile")
        .where("miscPassword.id = :id", { id: id })
        .andWhere("userProfile.id = :userProfileId", {
          userProfileId: userProfile.id,
        })
        .getOne();

      if (!isMiscPassword) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      isMiscPassword.name = req.body.name;

      MiscPasswordRepo.save(isMiscPassword as any);

      return res.status(200).send({
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  deleteMiscPassword: async (req: Request, res: Response, next: any) => {
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
          .json({ success: false, message: "No Data to display" });
      }
      const isMiscPassword = await MiscPasswordRepo.createQueryBuilder(
        "miscPassword"
      )
        .innerJoin("miscPassword.userProfile", "userProfile")
        .where("miscPassword.id = :id", { id: id })
        .andWhere("userProfile.id = :userProfileId", {
          userProfileId: userProfile.id,
        })
        .getOne();

      if (!isMiscPassword) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      await MiscPasswordRepo.delete({ id: parseInt(id) });

      return res.status(200).send({
        message: "Delete Successfull",
      });
    } catch (error) {
      next(error);
    }
  },

  getMiscPasswordDetailsById: async (
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

      const isMiscPassword = await MiscPasswordRepo.createQueryBuilder(
        "miscPassword"
      )
        .where("miscPassword.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("miscPassword.id = :id", { id: id })
        .getOne();

      const isHaveingPermission = await PermissionRepo.findOne({
        where: {
          miscAccountId: { id: id as any },
          buddy: { id: req.user as any },
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.MISC_PASSWORD_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "miscAccountId"],
      });

      if (!isMiscPassword && !isHaveingPermission) {
        return res.status(400).json({
          message: "No data found",
        });
      }

      return res.status(200).send({
        message: "Success",
        allowedData: isHaveingPermission?.miscAccountId,
        data: isMiscPassword,
      });
    } catch (error) {
      next(error);
    }
  },

  updateMiscPasswordDetailsById: async (
    req: Request,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const requiredFields = [
        "account_name",
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

      const isMiscPassword = await MiscPasswordRepo.createQueryBuilder(
        "miscPassword"
      )
        .where("miscPassword.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("miscPassword.id = :id", { id: id })
        .getOne();

      if (!isMiscPassword) {
        return res.status(400).json({
          message: "No data found",
        });
      }
      isMiscPassword.account_name = data?.account_name;
      isMiscPassword.website = data?.website;
      isMiscPassword.user_name = data?.user_name;
      isMiscPassword.password = data?.password;
      isMiscPassword.account_number = data?.account_number;
      isMiscPassword.account_nick_name = data?.account_nick_name;

      await MiscPasswordRepo.save(isMiscPassword);

      return res.status(200).send({
        message: " Updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
