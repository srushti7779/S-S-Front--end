import { Response } from "express";
import { Request } from "../../../../utils/@types";

import generateUid from "../../../../utils/crypto";
import { AppDataSource, s3 } from "../../../../config";
import File from "../../../models/File";
import { Permission } from "../../../models/permissions";
import { UserAuth } from "../../../models/UserAuth";
import Buddy from "../../../models/Buddies";
import { In } from "typeorm";
import { UserProfile } from "../../../models/UserProfile";
import Folder from "../../../models/Folder";

const FileRepo = AppDataSource.getRepository(File);
const PermissionRepo = AppDataSource.getRepository(Permission);
const UserAuthRepo = AppDataSource.getRepository(UserAuth);
const BuddyRepo = AppDataSource.getRepository(Buddy);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);
const FolderRepo = AppDataSource.getRepository(Folder);

export const permissionsController = {
  deletePermissions: async (req: Request, res: Response) => {
    try {
      const { id, buddyId } = req.params;

      const permissionData = await PermissionRepo.findOne({
        where: {
          id: id as any,
          userAuth: { id: req.user as any },
          buddy: { id: buddyId as any },
        },
      });

      if (!permissionData) {
        return res.status(400).json({
          message: "No permission found to this buddy",
        });
      }

      await PermissionRepo.delete(id);

      return res.status(200).send({
        message: "Delete successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  },

  createPermission: async (req: Request, res: Response) => {
    try {
      const { file_id, folder_id, buddy_ids, ...data } = req.body;
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      for (const buddy of buddy_ids) {
        if (folder_id) {
          const isFolderPermission = await PermissionRepo.findOne({
            where: {
              folder: { id: folder_id },
              buddy: { id: buddy },
            },
            relations: ["buddy", "folder"],
            select: ["id"],
          });

          if (isFolderPermission) {
            return res.status(400).json({
              message:
                "One of the buddy has already given the folder permission",
            });
          }
        }

        if (file_id) {
          const isFilePermission = await PermissionRepo.findOne({
            where: {
              file: { id: file_id },
              buddy: { id: buddy },
            },
            relations: ["buddy", "file"],
            select: ["id"],
          });
          if (isFilePermission) {
            return res.status(400).json({
              message: "One of the buddy has already given the file permission",
            });
          }
        }

        if (data.bankAccountId) {
          const isBankPermission = await PermissionRepo.findOne({
            where: {
              bankAccountId: { id: data.bankAccountId },
              buddy: { id: buddy },
            },
            relations: ["buddy", "bankAccountId"],
            select: ["id"],
          });
          if (isBankPermission) {
            return res.status(400).json({
              message:
                "One of the buddy has already given the bank account form permission",
            });
          }
        }

        if (data.creditCardId) {
          const isCreditCardPermission = await PermissionRepo.findOne({
            where: {
              creditCardId: { id: data.creditCardId },
              buddy: { id: buddy },
            },
            relations: ["buddy", "creditCardId"],
            select: ["id"],
          });

          if (isCreditCardPermission) {
            return res.status(400).json({
              message:
                "One of the buddy has already given the credit card form permission",
            });
          }
        }

        if (data.merchantAccountId) {
          const isMerchantPermission = await PermissionRepo.findOne({
            where: {
              merchantAccountId: { id: data.merchantAccountId },
              buddy: { id: buddy },
            },
            relations: ["buddy", "merchantAccountId"],
            select: ["id"],
          });
          if (isMerchantPermission) {
            return res.status(400).json({
              message:
                "One of the buddy has already given the merchant account form permission",
            });
          }
        }

        if (data.miscAccountId) {
          const isMiscPermission = await PermissionRepo.findOne({
            where: {
              miscAccountId: { id: data.miscAccountId },
              buddy: { id: buddy },
            },
            relations: ["buddy", "miscAccountId"],
            select: ["id"],
          });

          if (isMiscPermission) {
            return res.status(400).json({
              message:
                "One of the buddy has already given the misc account form permission",
            });
          }
        }

        if (data.passwordStorageId) {
          const isPassStoragePermission = await PermissionRepo.findOne({
            where: {
              passwordStorageId: { id: data.passwordStorageId },
              buddy: { id: buddy },
            },
            relations: ["buddy", "passwordStorageId"],
            select: ["id"],
          });
          if (isPassStoragePermission) {
            return res.status(400).json({
              message:
                "One of the buddy has already given the password form permission",
            });
          }
        }

        if (data.loanAccountId) {
          const isLoanPermission = await PermissionRepo.findOne({
            where: {
              loanAccountId: { id: data.loanAccountId },
              buddy: { id: buddy },
            },
            relations: ["buddy", "loanAccountId"],
            select: ["id"],
          });

          if (isLoanPermission) {
            return res.status(400).json({
              message:
                "One of the buddy has already given the loan account form permission",
            });
          }
        }

        if (data.recipeAccountId) {
          const isRecipePermission = await PermissionRepo.findOne({
            where: {
              recipeAccountId: { id: data.recipeAccountId },
              buddy: { id: buddy },
            },
            relations: ["buddy", "recipeAccountId"],
            select: ["id"],
          });

          if (isRecipePermission) {
            return res.status(400).json({
              message:
                "One of the buddy has already given the recipe form permission",
            });
          }
        }
      }

      const buddyData = await BuddyRepo.find({
        where: { user: { id: req.user as any }, buddy: { id: In(buddy_ids) } },
        select: {
          id: true,
          buddy: {
            id: true,
            email: true,
          },
          user: {
            id: true,
            email: true,
          },
        },
        relations: ["user", "buddy"],
      });

      if (!buddyData) {
        return res
          .status(200)
          .json({ success: false, message: "Data not found" });
      }
      const newPermission = new Permission();
      const allPermission = [];

      for (const buddy of buddyData) {
        newPermission.userAuth = req.user as any;
        newPermission.buddy = buddy.buddy.id as any;
        newPermission.bankAccountId = data?.bankAccountId;
        newPermission.creditCardId = data?.creditCardId;
        newPermission.loanAccountId = data?.loanAccountId;
        newPermission.merchantAccountId = data?.merchantAccountId;
        newPermission.miscAccountId = data?.miscAccountId;
        newPermission.recipeAccountId = data?.recipeAccountId;
        newPermission.passwordStorageId = data?.passwordStorageId;
        newPermission.form_type = data?.form_type;
        if (file_id) {
          const fileData = await FileRepo.findOne({
            where: {
              user: {
                id: userProfile?.id,
              },
              id: file_id,
            },
          });

          newPermission.file = fileData?.id as any;
        }

        if (folder_id) {
          const folderData = await FolderRepo.findOne({
            where: {
              user: {
                id: userProfile?.id,
              },
              id: folder_id,
            },
          });

          newPermission.folder = folderData?.id as any;
        }
        newPermission.canRead = data?.read || false;
        newPermission.canWrite = data?.write || false;
        newPermission.canShare = data?.share || false;
        if (data.timeReleaseDate) {
          newPermission.timeReleaseDate = data?.timeReleaseDate && true;
        } else if (data.instantReleaseDate) {
          newPermission.instantReleaseDate =
            data?.instantReleaseDate && new Date();
        }
        allPermission.push(newPermission);
      }

      await PermissionRepo.save(allPermission);

      return res.status(200).json({
        success: true,
        message: "Permission created",
      });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ success: false, message: "Something Went wrong!" });
    }
  },

  getPermission: async (req: Request, res: Response) => {
    try {
      const ids = req.query;
      const conditions: any = {
        userAuth: { id: req.user as any },
      };
      if (ids.file_id) {
        conditions.file = { id: ids.file_id };
      }
      if (ids.folder_id) {
        conditions.folder = { id: ids.folder_id };
      }
      if (ids.bankAccountId) {
        conditions.bankAccountId = { id: ids.bankAccountId };
      }
      if (ids.creditCardId) {
        conditions.creditCardId = { id: ids.creditCardId };
      }
      if (ids.loanAccountId) {
        conditions.loanAccountId = { id: ids.loanAccountId };
      }
      if (ids.merchantAccountId) {
        conditions.merchantAccountId = { id: ids.merchantAccountId };
      }
      if (ids.passwordStorageId) {
        conditions.passwordStorageId = { id: ids.passwordStorageId };
      }
      if (ids.miscAccountId) {
        conditions.miscAccountId = { id: ids.miscAccountId };
      }
      if (ids.recipeAccountId) {
        conditions.recipeAccountId = { id: ids.recipeAccountId };
      }
      const getAllPermission = await PermissionRepo.find({
        where: conditions,
        relations: [
          "file",
          "folder",
          "bankAccountId",
          "creditCardId",
          "loanAccountId",
          "merchantAccountId",
          "passwordStorageId",
          "miscAccountId",
          "recipeAccountId",
          "buddy",
        ],
      });

      return res.status(200).json({
        message: "Success",
        data: getAllPermission,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  },

  getSharedWithMe: async (req: Request, res: Response) => {
    try {
      const getAllSharedWithMe = await PermissionRepo.find({
        where: {
          buddy: { id: req.user as any },
          timeReleaseDate: false,
        },
        relations: [
          "file",
          "folder",
          "bankAccountId",
          "creditCardId",
          "loanAccountId",
          "merchantAccountId",
          "passwordStorageId",
          "miscAccountId",
          "recipeAccountId",
          "userAuth",
        ],
      });

      return res.status(200).send({
        message: "Success",
        data: getAllSharedWithMe,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  },
};
