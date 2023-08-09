import { Response } from "express";
import { Request } from "../../../../utils/@types";

import { AppDataSource } from "../../../../config";
import { UserProfile } from "../../../models/UserProfile";
import Folder from "../../../models/Folder";
import { UserAuth } from "../../../models/UserAuth";
import Plan from "../../../models/plans";
import { Verification } from "../../../models/verification";

const VerificationRepo = AppDataSource.getRepository(Verification);

export const verificationController = {
  update: async (req: Request, res: Response) => {
    try {
      const verificationData = await VerificationRepo.findOne({
        where: {
          userAuth: { id: req.user as any },
        },
      });

      if (!verificationData || verificationData.verification_status === true) {
        return res.status(400).json({
          message: "User Already Verified",
        });
      }

      const updateData: any = {
        email_sent_date: null,
        email_sent_expire_date: null,
        email_sent_for_verification: false,
        verification_status: true,
      };

      await VerificationRepo.update(updateData, {
        userAuth: { id: req.user as any },
      });

      return res.status(200).send({
        message: "Success",
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Internal server error", success: false });
    }
  },
};
