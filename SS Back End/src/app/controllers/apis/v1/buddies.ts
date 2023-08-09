import { AppDataSource } from "../../../../config";
import { Response } from "express";
import { Request } from "../../../../utils/@types";
import Buddy from "../../../models/Buddies";
import { UserAuth } from "../../../models/UserAuth";
import { Notification } from "../../../models/notification";
import { transporter } from "../../../../config";
import BuddyInvitation from "../../../models/invitation";
import PlanActivity from "../../../models/planActivity";

const buddyRepo = AppDataSource.getRepository(Buddy);
const authRepo = AppDataSource.getRepository(UserAuth);
const invitationRepo = AppDataSource.getRepository(BuddyInvitation);
const notificationRepo = AppDataSource.getRepository(Notification);
const PlanActivityRepo = AppDataSource.getRepository(PlanActivity);

export const buddyController = {
  getBuddies: async (req: Request, res: Response) => {
    const user = await authRepo.findOne({ where: { id: req.user as any } });
    const buddies = await buddyRepo.find({
      where: { user: { id: user?.id } },
      select: {
        id: true,
        relationshipStatus: true,
        buddyType: true,
        buddyStatus: true,
        buddy: {
          id: true,
          email: true,
          name: true,
        },
        user: {
          id: true,
          email: true,
          name: true,
        },
        createdAt: true,
        updatedAt: true,
      },
      relations: ["user", "buddy"],
    });
    const invitations = await invitationRepo.find({
      where: { user: { id: user?.id } },
      relations: ["user"],
    });
    return res.status(200).json({
      success: true,
      message: "Buddies fetched",
      buddies,
      invitations,
    });
  },

  addBuddy: async (req: Request, res: Response) => {
    try {
      const { email, relation, type } = req.body;
      const getPlan = await PlanActivityRepo.findOne({
        where: {
          user: { id: req.user as any },
        },
      });
      const getAllBuddy = await buddyRepo.find({
        where: {
          user: { id: req.user as any },
        },
        select: ["id"],
      });
      const getAllInvitation = await invitationRepo.find({
        where: {
          user: { id: req.user as any },
        },
        select: ["id"],
      });

      const buddy = await authRepo.findOne({ where: { email: email } });
      const user = await authRepo.findOne({ where: { id: req.user as any } });

      var primeBuddyExists = await buddyRepo.find({
        where: { user: { id: user?.id }, buddyType: "subprime" },
      });

      var extBuddies = await buddyRepo.findOne({
        where: { user: { id: user?.id }, buddy: { email: email } },
        relations: ["user", "buddy"],
      });

      var extInvitations = await invitationRepo.find({
        where: { user: { id: user?.id }, buddy: email },
      });

      var extNotifications = await notificationRepo.find({
        where: { email: email, type: "buddy" },
      });

      if (
        parseInt(getPlan?.buddies as any) <=
        getAllBuddy.length + getAllInvitation.length
      ) {
        return res.status(400).send({
          message: "Maximum buddy limit reached",
        });
      }

      if (extBuddies) {
        return res
          .status(200)
          .json({ success: false, message: "Buddy already exists" });
      }

      if (extInvitations.length > 0) {
        return res
          .status(200)
          .json({ success: false, message: "Buddy invitation already sent" });
      }

      if (extNotifications.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Buddy invitation already sent" });
      }
      var notification = new Notification();
      notification.email = email;
      notification.message = "You have a new buddy request";
      notification.type = "Buddy";
      notification.status = "unread";
      notification.data = JSON.stringify({
        email: email,
        relation: relation,
        type: "Buddy",
        inviterId: req.user,
        inviterEmail: user?.email,
      });
      await notificationRepo.save(notification);
      if (!buddy) {
        var invitation = new BuddyInvitation();
        invitation.buddy = email;
        invitation.relationshipStatus = relation;
        invitation.buddyType =
          primeBuddyExists.length >= 1 ? "Buddy" : "Subprime";
        invitation.buddyStatus = "Invited";
        invitation.user = user!;

        await invitationRepo.save(invitation);

        const mailOptions = {
          from: "Store And Share Vault",
          to: email,
          subject: "Buddy Request",
          html: `<p>Hi ${email.split("@")[0]},</p><br/><p> ${
            user?.email.split("@")[0]
          } would like to add you as a Buddy on their Store and Share Vault Account! Click the link below to register:</p><br/><a href="${
            process.env.CLIENT_URL
          }/auth/sign-up">${
            process.env.CLIENT_URL
          }/auth/sign-up</a><br/><p>Once you register, you will be able to access your buddy's account and view their files.</p><br/><p>Thanks,</p><br/><p>Store and Share Vault Team</p>`,
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
          } else {
          }
        });

        return res
          .status(200)
          .json({ success: true, message: "Buddy request sent" });
      } else {
        var newBuddy = new Buddy();
        newBuddy.user = user!;
        newBuddy.buddy = buddy;
        newBuddy.relationshipStatus = relation;
        newBuddy.buddyType =
          primeBuddyExists.length >= 1 ? "Buddy" : "Subprime";
        newBuddy.buddyStatus = "pending";

        await buddyRepo.save(newBuddy);
        const mailOptions = {
          from: "Store And Share Vault",
          to: email,
          subject: "Buddy Request",
          html: `<p>Hi ${email.split("@")[0]},</p><br/><p> ${
            user?.email.split("@")[0]
          } would like to add you as a Buddy on their Store and Share Vault Account! Click the link below to login:</p><br/><a href="${
            process.env.CLIENT_URL
          }/auth/login">${
            process.env.CLIENT_URL
          }/auth/login</a><br/><p>Once you login, you will be able to access your buddy's account and view their files.</p><br/><p>Thanks,</p><br/><p>Store and Share Vault Team</p>`,
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            console.log(error);
          } else {
          }
        });

        return res
          .status(200)
          .json({ success: true, message: "Buddy request sent" });
      }
    } catch (error) {
      return res.status(400).send({
        message: "Something went wrong",
      });
    }
  },

  acceptBuddy: async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const user = await authRepo.findOne({ where: { id: req.user as any } });

      const invitation = await invitationRepo.findOne({
        where: { user: { id: id }, buddy: user?.email },
      });

      const extNotification = await notificationRepo.findOne({
        where: {
          email: user?.email,
        },
      });

      if (invitation) {
        var newBuddy = new Buddy();
        newBuddy.user = invitation.user;
        newBuddy.buddy = user!;
        newBuddy.relationshipStatus = invitation.relationshipStatus;
        newBuddy.buddyType = invitation.buddyType;
        newBuddy.buddyStatus = "accepted";

        await buddyRepo.save(newBuddy);

        await invitationRepo.delete(invitation.id!);

        if (extNotification) {
          await notificationRepo.delete(extNotification.id!);
        }

        return res
          .status(200)
          .json({ success: true, message: "Buddy request accepted" });
      }

      const buddy = await buddyRepo.findOne({
        where: { user: { id: id }, buddy: { id: user?.id } },
      });

      if (buddy) {
        buddy.buddyStatus = "accepted";
        await buddyRepo.save(buddy);

        if (extNotification) {
          await notificationRepo.delete(extNotification.id!);
        }
        return res
          .status(200)
          .json({ success: true, message: "Buddy request accepted" });
      }
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Buddy request not found" });
    }
  },

  getBuddy: async (req: Request, res: Response) => {},

  updateBuddy: async (req: Request, res: Response) => {},

  deleteBuddy: async (req: Request, res: Response) => {
    try {
      const { type, id } = req.body;

      if (type === "BD") {
        const buddy = await buddyRepo.findOne({ where: { id: id } });
        await buddyRepo.delete(buddy?.id!);
      } else {
        const invitation = await invitationRepo.findOne({ where: { id: id } });
        await invitationRepo.delete(invitation?.id!);
        await notificationRepo.delete({
          email: invitation?.buddy,
          type: "buddy",
        });
      }

      return res.status(200).json({ success: true, message: "Buddy deleted" });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });
    }
  },
};
