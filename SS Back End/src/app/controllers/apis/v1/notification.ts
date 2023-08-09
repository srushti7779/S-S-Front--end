import { Response } from "express";
import { Request } from "../../../../utils/@types";

import generateUid from "../../../../utils/crypto";
import { AppDataSource, s3 } from "../../../../config";
import { Notification } from "../../../models/notification";
import { UserAuth } from "../../../models/UserAuth";

const userRepo = AppDataSource.getRepository(UserAuth);
const notificationRepo = AppDataSource.getRepository(Notification);

export const notificationController = {
  getNotifications: async (req: Request, res: Response) => {
    try {
      const user = await userRepo.findOne({ where: { id: req.user as any } });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User does not exist" });
      }

      const notification = await notificationRepo.find({
        where: { email: user.email },
      });
      if (!notification) {
        return res
          .status(400)
          .json({ success: false, message: "No notification found" });
      }

      return res.status(200).json({
        success: true,
        message: "Notification found",
        data: notification,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  },
};
