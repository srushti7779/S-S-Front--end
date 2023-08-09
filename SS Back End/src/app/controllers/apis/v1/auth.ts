import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AppDataSource, twilio } from "../../../../config";
import { UserAuth } from "../../../models/UserAuth";
import { Admin } from "../../../models/admin";
import bcrypt from "bcrypt";
import generateOTP from "../../../../utils/generateOtp";
import { transporter } from "../../../../config";
import { OAuth2Client } from "google-auth-library";
import BuddyInvitation from "../../../models/invitation";
import Buddy from "../../../models/Buddies";
import { Verification } from "../../../models/verification";

const UserRepo = AppDataSource.getRepository(UserAuth);
const AdminRepo = AppDataSource.getRepository(Admin);
const BuddyInvitationRepo = AppDataSource.getRepository(BuddyInvitation);
const BuddyRepo = AppDataSource.getRepository(Buddy);
const VerificationRepo = AppDataSource.getRepository(Verification);

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await UserRepo.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found", success: false });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Incorrect password", success: false });
      }
      if (!user.is2fa) {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || "hcjhad7842687ahdcb"
        );
        return res.json({ token, user, success: true, is2fa: false });
      }

      const OTP = generateOTP();

      twilio.messages
        .create({
          body: `Hi! ${user.name} your Store And Share Vault verification OTP is ${OTP}..`,
          to: user.phoneNumber,
          from: process.env.TWILIO_PHONE,
        })
        .then(async (message) => {
          if (!message.sid)
            return res
              .status(200)
              .json({ success: false, message: "Something went wrong!" });
          var date = new Date();
          user.generatedOTP = OTP;
          user.otpExpiresIn = new Date(date.getTime() + 300000);
          await UserRepo.save(user);

          return res.json({
            id: user.id,
            success: true,
            message: "OTP sent successfully",
            is2fa: true,
          });
        })
        .catch((error) => {
          console.error(error);
          return res.json({ success: false, message: "Something went wrong!" });
        });
    } catch (error) {
      res.status(400).json({ success: false, message: "Something went wrong" });
    }
  },

  loginWithGoogle: async (req: Request, res: Response) => {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      var ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      var data = ticket.getPayload();

      if (!data) {
        return res
          .status(200)
          .json({ success: false, message: "Something went wrong" });
      }

      const user = await UserRepo.findOne({ where: { email: data.email } });

      if (!user) {
        return res
          .status(200)
          .json({ success: false, message: "User not found" });
      }
      if (!user.is2fa) {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || "hcjhad7842687ahdcb"
        );
        return res.json({ token, user, success: true, is2fa: false });
      }
      const OTP = generateOTP();

      twilio.messages
        .create({
          body: `Hi! ${user.name} your Store And Share Vault verification OTP is ${OTP}..`,
          to: user.phoneNumber,
          from: process.env.TWILIO_PHONE,
        })
        .then(async (message) => {
          if (!message.sid)
            return res
              .status(200)
              .json({ success: false, message: "Something went wrong!" });
          var date = new Date();
          user.generatedOTP = OTP;
          user.otpExpiresIn = new Date(date.getTime() + 300000);
          await UserRepo.save(user);

          return res.json({
            id: user.id,
            success: true,
            message: "OTP sent successfully",
            is2fa: true,
          });
        })
        .catch((error) => {
          console.error(error);
          return res.json({ success: false, message: "Something went wrong!" });
        });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .json({ success: false, message: "Something went wrong" });
    }
  },

  register: async (req: Request, res: Response) => {
    try {
      const { name, email, password, phoneNumber } = req.body;

      if (!name || !email || !password || !phoneNumber) {
        return res
          .status(400)
          .json({ message: "Please fill all the fields", success: false });
      }

      const user = await UserRepo.findOne({
        where: [{ phoneNumber }, { email }],
      });

      if (user) {
        return res
          .status(400)
          .json({ message: "User already exists", success: false });
      }

      const isBuddyInvited = await BuddyInvitationRepo.findOne({
        where: {
          buddy: email,
          buddyStatus: "Invited",
        },
        relations: ["user"],
      });

      const newUser = new UserAuth();
      newUser.name = name;
      newUser.email = email;
      newUser.password = bcrypt.hashSync(password, 10);
      newUser.phoneNumber = phoneNumber;

      const newUserEntred = await UserRepo.save(newUser);
      if (isBuddyInvited) {
        const upDateBuddy = new Buddy();
        upDateBuddy.user = isBuddyInvited.user.id as any;
        upDateBuddy.relationshipStatus = isBuddyInvited.relationshipStatus;
        upDateBuddy.buddyType = isBuddyInvited.buddyType;
        upDateBuddy.buddyStatus = "Pending";
        upDateBuddy.buddy = newUserEntred.id as any;

        await BuddyRepo.save(upDateBuddy);

        await BuddyInvitationRepo.delete({
          buddy: email,
          buddyStatus: "Invited",
        });
      }

      const mailOptions = {
        from: "Store And Share Vault",
        to: email,
        subject: "Welcome Email",
        html: `<p>${name}</p>

                <p>Welcome to Store &amp; Share Vault, your central location for managing and sharing important files, documents and photos with loved ones. Let others know you care about them by adding them as a Buddy and sharing this information with them in a closed network. Find comfort in the fact that you and your loved ones will never have to frantically search for important information ever again!</p>

                <p>Feel free to reach out to our Customer Support Team at anytime with questions, comments or concerns. Info@StoreAndShareVault.io</p>`,
      };

      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.log(error);
        } else {
        }
      });

      if (!newUser.is2fa) {
        const token = jwt.sign(
          { id: newUser.id, email: newUser.email },
          process.env.JWT_SECRET || "hcjhad7842687ahdcb"
        );
        return res.json({ token, newUser, success: true, is2fa: false });
      }

      // Generate OTP
      const OTP = generateOTP();

      // Send OTP to the user's phone number
      twilio.messages
        .create({
          body: `Hi! ${newUser.name}, your Store And Share Vault verification OTP is ${OTP}..`,
          to: newUser.phoneNumber,
          from: process.env.TWILIO_PHONE,
        })
        .then(async (message) => {
          if (!message.sid) {
            // Handle error when OTP sending fails
            console.error("Failed to send OTP");
          } else {
            // Save the generated OTP and its expiration time
            const date = new Date();
            newUser.generatedOTP = OTP;
            newUser.otpExpiresIn = new Date(date.getTime() + 300000);

            await UserRepo.save(newUser);

            // Handle successful OTP sending
            return res.json({
              id: newUser.id,
              success: true,
              message: "OTP sent successfully",
              is2fa: true,
            });
          }
        })
        .catch((error) => {
          console.error(error);
          return res
            .status(400)
            .json({ success: false, message: "Something went wrong!" });
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },

  twoFactorAuth: async (req: Request, res: Response) => {
    try {
      const { id, otp } = req.body;

      const user = await UserRepo.findOne({ where: { id } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }
      //check otp is correct or not
      if (user.generatedOTP != otp) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect OTP" });
      }

      //check otp is expired or not
      if (user.otpExpiresIn < new Date()) {
        return res.status(400).json({ success: false, message: "OTP expired" });
      }
      const getVerificationDetails = await VerificationRepo.findOne({
        where: {
          email: user.email,
        },
      });

      const updateVerification: any = {
        ...getVerificationDetails,
        email_sent_date: null,
        email_sent_expire_date: null,
        email_sent_for_verification: false,
        verification_status: true,
      };

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "hcjhad7842687ahdcb"
      );
      await VerificationRepo.save(updateVerification);

      return res.json({ success: true, token });
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: true, message: "Something went wrong" });
    }
  },

  resendCode: async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const otp = generateOTP();

      const user = await UserRepo.findOne({ where: { id } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      twilio.messages
        .create({
          body: `Hi! ${user.name} your verification OTP is ${otp}.`,
          to: user.phoneNumber,
          from: process.env.TWILIO_PHONE,
        })
        .then(async (message) => {
          if (!message.sid)
            return res
              .status(400)
              .json({ success: false, message: "Something went wrong!" });
          var date = new Date();
          user.generatedOTP = otp;
          user.otpExpiresIn = new Date(date.getTime() + 300000);
          await UserRepo.save(user);

          return res.json({ success: true, message: "OTP sent successfully" });
        })
        .catch((error) => {
          console.error(error);
          return res
            .status(400)
            .json({ success: false, message: "Something went wrong!" });
        });
    } catch (error) {
      res.status(400).json({ message: "Something went wrong", success: false });
    }
  },

  sendForgotPasswordOTP: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      const user = await UserRepo.findOne({ where: { email } });

      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }

      const OTP = generateOTP();

      twilio.messages
        .create({
          body: `Hi! ${user.name} your verification OTP is ${OTP} for forgot password request.`,
          to: user.phoneNumber,
          from: process.env.TWILIO_PHONE,
        })
        .then(async (message) => {
          if (!message.sid)
            return res
              .status(200)
              .json({ success: false, message: "Something went wrong!" });
          var date = new Date();
          user.generatedOTP = OTP;
          user.otpExpiresIn = new Date(date.getTime() + 300000);
          await UserRepo.save(user);

          return res.json({
            id: user.id,
            success: true,
            message: "OTP sent successfully",
          });
        })
        .catch((error) => {
          console.error(error);
          return res.json({ success: false, message: "Something went wrong!" });
        });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .json({ success: false, message: "Something went wrong" });
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      const { email, password, otp } = req.body;
      const user = await UserRepo.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }
      //check otp is correct or not
      if (user.generatedOTP != otp) {
        return res
          .status(400)
          .json({ success: false, message: "Incorrect OTP" });
      }

      //check otp is expired or not
      if (user.otpExpiresIn < new Date()) {
        return res.status(400).json({ success: false, message: "OTP expired" });
      }
      const newPassword = bcrypt.hashSync(password, 10);

      user.password = newPassword;

      UserRepo.save(user);

      return res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });
    }
  },

  loginAdmin: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await AdminRepo.findOne({ where: { email } });

      if (!user) {
        return res
          .status(200)
          .json({ message: "User not found", success: false });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .json({ message: "Incorrect password", success: false });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "hcjhad7842687ahdcb"
      );
      return res.json({ token, user, success: true, is2fa: false });
    } catch (error) {
      console.log(error);
      res.status(200).json({ success: false, message: "Something went wrong" });
    }
  },

  registerAdmin: async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(200)
          .json({ message: "Please fill all the fields", success: false });
      }

      const user = await UserRepo.findOne({ where: { email } });

      if (user) {
        return res
          .status(200)
          .json({ message: "User already exists", success: false });
      }

      const newUser = new Admin();
      newUser.name = name;
      newUser.email = email;
      newUser.password = bcrypt.hashSync(password, 10);
      newUser.role = "admin";

      var newEntry = await AdminRepo.save(newUser);

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newEntry.role },
        process.env.JWT_SECRET || "hcjhad7842687ahdcb"
      );
      res.json({ token, success: true });
    } catch (error) {
      console.log(error);
      res.status(200).json({ success: false, message: "Something went wrong" });
    }
  },
};
