import { Response } from "express";
import { Request } from "../../../../utils/@types";

import generateUid from "../../../../utils/crypto";
import { AppDataSource, s3, stripe } from "../../../../config";
import File from "../../../models/File";
import { UserProfile } from "../../../models/UserProfile";
import Folder from "../../../models/Folder";
import { UserAuth } from "../../../models/UserAuth";
import Plan from "../../../models/plans";
import { Verification } from "../../../models/verification";
import PlanActivity from "../../../models/planActivity";

const ProfileRepo = AppDataSource.getRepository(UserProfile);
const UserAuthRepo = AppDataSource.getRepository(UserAuth);
const FolderRepo = AppDataSource.getRepository(Folder);
const PlanActivityRepo = AppDataSource.getRepository(PlanActivity);
const VerificationRepo = AppDataSource.getRepository(Verification);

export const profileController = {
  find: async (req: Request, res: Response) => {
    try {
      // const userProfile = await ProfileRepo.createQueryBuilder("userProfile").innerJoinAndSelect("userProfile.folders", "Folder").where("userProfile.userAuth = :id", { id: req.user }).getOne();

      //create query builder to find userprofile according to user id

      const userProfile = await ProfileRepo.createQueryBuilder("userProfile")
        .innerJoin("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(400)
          .json({ message: "Profile does not exist", success: false });
      }

      const userProfileData = await ProfileRepo.findOne({
        relations: ["files", "folders", "userAuth"],
        select: {
          userAuth: {
            id: true,
            email: true,
            name: true,
            phoneNumber: true,
            is2fa: true,
            isActive: true,
            isStaff: true,
            dateJoined: true,
            lastLogin: true,
            isSuperUser: true,
          },
        },
        where: { id: userProfile.id },
      });

      if (!userProfileData) {
        return res
          .status(400)
          .json({ message: "Profile does not exist", success: false });
      }
      return res.status(200).json({
        message: "Profile found successfully",
        success: true,
        data: userProfileData,
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Internal server error", success: false });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const file = req.file!;
      const { fname, lname, verificationPeriod, location, email } = req.body;

      const verificationTimeStamp = () => {
        switch (verificationPeriod) {
          case "One Week":
            return 7;
          case "Two Week":
            return 14;
          case "One Month":
            return 28;
          default:
            break;
        }
      };
      const userAuth = await UserAuthRepo.findOne({
        where: { id: req.user as any },
      });

      const userProfile = await ProfileRepo.createQueryBuilder("userProfile")
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();
      if (userProfile) {
        if (req.file) {
          //delete exsisting file from aws s3
          const deleteParams = {
            Bucket:
              process.env.AWS_STORAGE_BUCKET_NAME || "store-and-share-vault",
            Key: userProfile.profilePictureKey,
          };

          const ackno = await s3.deleteObject(deleteParams).promise();
          if (!ackno)
            return res
              .status(200)
              .json({ success: false, message: "something went wrong!" });

          const file = req.file!;
          const key = generateUid(16);
          var fileData = {
            name:
              (req.body.parent_id || 0).toString() +
              req.user +
              `|` +
              file.originalname,
            ext: file.originalname.split(".")[1],
            size: file.size,
            key: key,
            folderId: req.body.parent_id || 0,
            userId: req.user,
          };
          const params = {
            Bucket:
              process.env.AWS_STORAGE_BUCKET_NAME || "store-and-share-vault",
            Key: key + "." + fileData.ext,
            ACL: "public-read",
            Body: file.buffer,
          };

          //upload file to aws s3
          const data = await s3.upload(params).promise();
          if (!data)
            return res
              .status(500)
              .json({ success: false, message: "something went wrong!" });

          userProfile.profilePicture = data.Location;
          userProfile.profilePictureKey = data.Key;
        }

        userProfile.location = location;
        userProfile.verficationPeriod = verificationTimeStamp() as any;

        await ProfileRepo.save(userProfile);
        return res
          .status(200)
          .json({ success: true, message: "Profile updated successfully" });
      } else {
        const plan = await PlanActivityRepo.findOne({
          where: { user: { id: req.user as any } },
        });

        const key = generateUid(16);
        var fileData = {
          name:
            (req.body.parent_id || 0).toString() +
            req.user +
            `|` +
            file.originalname,
          ext: file.originalname.split(".")[1],
          size: file.size,
          key: key,
          folderId: req.body.parent_id || 0,
          userId: req.user,
        };
        const params = {
          Bucket:
            process.env.AWS_STORAGE_BUCKET_NAME || "store-and-share-vault",
          Key: key + "." + fileData.ext,
          ACL: "public-read",
          Body: file.buffer,
        };

        //upload file to aws s3
        const data = await s3.upload(params).promise();
        if (!data) {
          return res
            .status(200)
            .json({ success: false, message: "something went wrong!" });
        }

        const profile = new UserProfile();
        profile.userAuth = userAuth!;
        profile.firstName = fname;
        profile.lastName = lname;
        profile.email = email;
        profile.planTitle = plan?.title as any;
        profile.location = location;
        profile.verficationPeriod = verificationTimeStamp() as any;
        profile.profilePicture = data.Location;
        profile.profilePictureKey = data.Key;
        profile.totalBuddies = plan?.buddies as any;
        profile.storage =
          ((plan?.storage as any) * 1024 * 1024).toString() ||
          (5 * 1024 * 1024).toString();
        profile.storageLeft =
          ((plan?.storage as any) * 1024 * 1024).toString() ||
          (5 * 1024 * 1024).toString();

        var response = await ProfileRepo.save(profile);

        const verification = new Verification();
        verification.email = email;
        verification.verification_status = true;
        verification.verficationPeriod = verificationTimeStamp() as any;
        verification.userAuth = req.user as any;
        await VerificationRepo.save(verification);

        const folder = new Folder();
        folder.name = "root";
        folder.user = response!;

        await FolderRepo.save(folder);

        return res
          .status(200)
          .json({ success: true, message: "Profile created successfully" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { fullName, userName, verficationPeriod, location } = req.body;
      const userProfile = await ProfileRepo.createQueryBuilder("userProfile")
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();
      if (!userProfile) {
        return res.status(400).json({ message: "Profile does not exist" });
      }

      const userAuth = await UserAuthRepo.findOne({
        where: { id: req?.user as any },
      });
      if (!userAuth) {
        return res.status(400).json({ message: "User does not exist" });
      }

      if (req.file) {
        //delete exsisting file from aws s3
        const deleteParams = {
          Bucket:
            process.env.AWS_STORAGE_BUCKET_NAME || "store-and-share-vault",
          Key: userProfile.profilePictureKey,
        };

        const ackno = await s3.deleteObject(deleteParams).promise();
        if (!ackno)
          return res
            .status(200)
            .json({ success: false, message: "something went wrong!" });

        const file = req.file!;
        const key = generateUid(16);
        var fileData = {
          name:
            (req.body.parent_id || 0).toString() +
            req.user +
            `|` +
            file.originalname,
          ext: file.originalname.split(".")[1],
          size: file.size,
          key: key,
          folderId: req.body.parent_id || 0,
          userId: req.user,
        };
        const params = {
          Bucket:
            process.env.AWS_STORAGE_BUCKET_NAME || "store-and-share-vault",
          Key: key + "." + fileData.ext,
          ACL: "public-read",
          Body: file.buffer,
        };

        //upload file to aws s3
        const data = await s3.upload(params).promise();
        if (!data)
          return res
            .status(500)
            .json({ success: false, message: "something went wrong!" });

        userProfile.profilePicture = data.Location;
        userProfile.profilePictureKey = data.Key;
      }

      userProfile.location = location;
      userProfile.verficationPeriod = verficationPeriod;

      await ProfileRepo.save(userProfile);

      return res
        .status(200)
        .json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .json({ success: false, message: "Internal server error" });
    }
  },

  updateProfileStorage: async (req: Request, res: Response) => {
    try {
      const { plan, storage } = req.body;
    } catch (error) {
      return res.status(400).send({ message: "Something went wrong" });
    }
  },
};
