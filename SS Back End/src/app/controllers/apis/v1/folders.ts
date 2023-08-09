import { Response } from "express";
import { Request } from "../../../../utils/@types";
import generateUid from "../../../../utils/crypto";
import { AppDataSource } from "../../../../config";
import Folder from "../../../models/Folder";
import { UserProfile } from "../../../models/UserProfile";
import { Permission } from "../../../models/permissions";

const FolderRepo = AppDataSource.getRepository(Folder);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);
const PermissionRepo = AppDataSource.getRepository(Permission);

export const folderController = {
  getFolders: async (req: Request, res: Response) => {
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
          .json({ success: false, message: "Profile does not exist" });
      }

      const isHaveingPermission = await PermissionRepo.find({
        where: {
          buddy: { id: req.user as any },
          timeReleaseDate: false,
        },
        relations: ["buddy", "folder", "userAuth"],
      });

      let allowedFile = [];
      if (isHaveingPermission.length > 0) {
        for (const folder of isHaveingPermission) {
          if (folder.folder) {
            const files = await FolderRepo.findOne({
              where: {
                id: folder.folder?.id,
              },
              relations: ["files"],
            });
            allowedFile.push(files);
          }
        }
      }

      const options = {
        where: {
          user: {
            id: userProfile.id,
          },
        },
        relations: ["files"],
      };

      const folders = await FolderRepo.find(options);

      if (folders.length <= 0) {
        return res.json({ message: "Folders does not exist" });
      }

      return res.json({
        success: true,
        message: "Folders found successfully",
        data: folders.reverse(),
        allowedFile,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .json({ success: false, message: "Internal server error" });
    }
  },

  createFolder: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res
          .status(200)
          .json({ success: false, message: "Please provide a name" });
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
          .json({ success: false, message: "Profile does not exist" });
      }

      const folder = new Folder();
      folder.name = name + "|" + generateUid(16);
      folder.user = userProfile;

      await FolderRepo.save(folder);

      return res.json({
        success: true,
        message: "Folder created successfully",
        data: folder,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .json({ success: false, message: "Internal server error" });
    }
  },

  updateFolder: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const { id } = req.params;

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Please provide a name" });
      }

      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(400)
          .json({ success: false, message: "Profile does not exist" });
      }

      //find folder based on folder id and user profile id
      const folder = await FolderRepo.createQueryBuilder("folder")
        .innerJoin("folder.user", "user")
        .where("user.id = :id", { id: userProfile?.id })
        .andWhere("folder.id = :folderId", { folderId: id })
        .getOne();

      if (!folder) {
        return res
          .status(400)
          .json({ success: false, message: "Folder does not exist" });
      }
      if (folder.name.split("|")[0] == "root") {
        return res
          .status(400)
          .json({ success: false, message: "Root folder cannot be updated" });
      }
      folder.name = name + "|" + generateUid(16);
      await FolderRepo.save(folder);
      return res.json({
        success: true,
        message: "Folder updated successfully",
        data: folder,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  },

  getFolder: async (req: Request, res: Response) => {
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
          .json({ success: false, message: "Profile does not exist" });
      }

      const options = {
        where: {
          user: {
            id: userProfile.id,
          },
          id: parseInt(req.params.id),
        },
        relations: ["files"],
      };

      const folder = await FolderRepo.findOne(options);

      if (!folder) {
        return res.json({ message: "Folders does not exist" });
      }

      return res.json({
        success: true,
        message: "Folders found successfully",
        data: folder,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .json({ success: false, message: "Internal server error" });
    }
  },

  deleteFolder: async (req: Request, res: Response) => {
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
          .json({ success: false, message: "Profile does not exist" });
      }

      const findFolder = await FolderRepo.findOne({
        where: { id: parseInt(req.params.id), user: { id: userProfile.id } },
      });
      if (!findFolder) {
        return res
          .status(200)
          .json({ success: false, message: "Folder does not exist" });
      }
      if (findFolder.name.split("|")[0] == "root") {
        return res
          .status(200)
          .json({ success: false, message: "Root folder cannot be updated" });
      }
      await FolderRepo.delete(findFolder.id);

      return res.json({
        success: true,
        message: "Folder deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
