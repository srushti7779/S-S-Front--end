import { Response } from "express";
import { Request } from "../../../../utils/@types";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../../config";
import { UserProfile } from "../../../models/UserProfile";
import PasswordStorage from "../../../models/PasswordStorageForm";
import { Permission } from "../../../models/permissions";
import { PERMISSION_FORM_TYPE_ENUMS } from "../../../../utils/helper";

const PasswordStorageRepo = AppDataSource.getRepository(PasswordStorage);
const PermissionRepo = AppDataSource.getRepository(Permission);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);

export const passwordStorageController = {
  postPasswordStorage: async (req: Request, res: Response, next: any) => {
    try {
      const { website, user_name, password, account_nick_name } = req.body;
      const requiredFields = [
        "website",
        "user_name",
        "password",
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

      const newLoanAccount = new PasswordStorage();
      newLoanAccount.userProfile = userProfile?.id as any;
      newLoanAccount.website = website;
      newLoanAccount.user_name = user_name;
      newLoanAccount.password = password;
      newLoanAccount.account_nick_name = account_nick_name;

      await PasswordStorageRepo.save(newLoanAccount);

      return res.status(200).json({
        message: "Password Storage saved Successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getPasswordStorage: async (req: Request, res: Response, next: any) => {
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
          message: "No password storage forms to display",
        });
      }
      const isPasswordStorage = await PasswordStorageRepo.createQueryBuilder(
        "passwordStorage"
      )
        .where("passwordStorage.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .getMany();

      const isHaveingPermission = await PermissionRepo.find({
        where: {
          buddy: { id: req.user as any },
          timeReleaseDate: false,
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.PASSWORD_STORAGE_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "passwordStorageId"],
      });
      const allowedData = [];
      for (const passwordStorage of isHaveingPermission) {
        allowedData.push(passwordStorage.passwordStorageId);
      }

      if (!isPasswordStorage && isHaveingPermission.length < 0) {
        return res.status(400).json({
          message: "No password storage forms attached",
        });
      }

      return res.status(200).send({
        message: "Success",
        data: isPasswordStorage,
        allowedData,
      });
    } catch (error) {
      next(error);
    }
  },

  deletePasswordStorage: async (req: Request, res: Response, next: any) => {
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
      const isPasswordStorage = await PasswordStorageRepo.createQueryBuilder(
        "passwordStorage"
      )
        .innerJoin("passwordStorage.userProfile", "userProfile")
        .where("passwordStorage.id = :id", { id: id })
        .andWhere("userProfile.id = :userProfileId", {
          userProfileId: userProfile.id,
        })
        .getOne();

      if (!isPasswordStorage) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      await PasswordStorageRepo.delete({ id: parseInt(id) });

      return res.status(200).send({
        message: "Delete Successfull",
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

      const isPasswordStorage = await PasswordStorageRepo.createQueryBuilder(
        "passwordStorage"
      )
        .innerJoin("passwordStorage.userProfile", "userProfile")
        .where("passwordStorage.id = :id", { id: id })
        .andWhere("userProfile.id = :userProfileId", {
          userProfileId: userProfile.id,
        })
        .getOne();

      if (!isPasswordStorage) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      isPasswordStorage.name = req.body.name;

      PasswordStorageRepo.save(isPasswordStorage as any);

      return res.status(200).send({
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  getPasswordStorageDetailsById: async (
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

      const isPasswordStorage = await PasswordStorageRepo.createQueryBuilder(
        "passwordStorage"
      )
        .where("passwordStorage.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("passwordStorage.id = :id", { id: id })
        .getOne();

      const isHaveingPermission = await PermissionRepo.findOne({
        where: {
          passwordStorageId: { id: id as any },
          buddy: { id: req.user as any },
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.PASSWORD_STORAGE_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "passwordStorageId"],
      });

      if (!isPasswordStorage && !isHaveingPermission) {
        return res.status(400).json({
          message: "No data found",
        });
      }

      return res.status(200).send({
        message: "Success",
        allowedData: isHaveingPermission?.passwordStorageId,
        data: isPasswordStorage,
      });
    } catch (error) {
      next(error);
    }
  },

  updatePasswordStorageDetailsById: async (
    req: Request,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const requiredFields = [
        "website",
        "user_name",
        "password",
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

      const isPasswordStorage = await PasswordStorageRepo.createQueryBuilder(
        "passwordStorage"
      )
        .where("passwordStorage.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("passwordStorage.id = :id", { id: id })
        .getOne();

      if (!isPasswordStorage) {
        return res.status(400).json({
          message: "No data found",
        });
      }
      isPasswordStorage.website = data?.website;
      isPasswordStorage.user_name = data?.user_name;
      isPasswordStorage.password = data?.password;
      isPasswordStorage.account_nick_name = data?.account_nick_name;

      await PasswordStorageRepo.save(isPasswordStorage);

      return res.status(200).send({
        message: " Updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
