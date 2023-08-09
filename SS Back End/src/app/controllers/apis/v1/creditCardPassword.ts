import { Response } from "express";
import { Request } from "../../../../utils/@types";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../../config";
import { UserProfile } from "../../../models/UserProfile";
import CreditCardPassword from "../../../models/CreditCardPassword";
import { Permission } from "../../../models/permissions";
import { PERMISSION_FORM_TYPE_ENUMS } from "../../../../utils/helper";

const CreditCardRepo = AppDataSource.getRepository(CreditCardPassword);
const PermissionRepo = AppDataSource.getRepository(Permission);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);

export const creditCardController = {
  postCreditCard: async (req: Request, res: Response, next: any) => {
    try {
      const {
        credit_card_name,
        website,
        user_name,
        password,
        credit_card_number,
        payment_date,
        account_nick_name,
      } = req.body;
      const requiredFields = [
        "credit_card_name",
        "website",
        "user_name",
        "password",
        "credit_card_number",
        "payment_date",
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

      const newCreditCard = new CreditCardPassword();
      newCreditCard.userProfile = userProfile?.id as any;
      newCreditCard.credit_card_name = credit_card_name;
      newCreditCard.website = website;
      newCreditCard.user_name = user_name;
      newCreditCard.password = password;
      newCreditCard.credit_card_number = credit_card_number;
      newCreditCard.payment_date = payment_date;
      newCreditCard.account_nick_name = account_nick_name;

      await CreditCardRepo.save(newCreditCard);

      return res.status(200).json({
        message: "Credit Card saved Successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getCreditCard: async (req: Request, res: Response, next: any) => {
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
          .json({ success: false, message: "No credit cards to display" });
      }
      const isCreditCard = await CreditCardRepo.createQueryBuilder("creditCard")
        .where("creditCard.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .getMany();

      const isHaveingPermission = await PermissionRepo.find({
        where: {
          buddy: { id: req.user as any },
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.CREDIT_CARD_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "creditCardId"],
      });
      const allowedData = [];
      for (const creditCard of isHaveingPermission) {
        allowedData.push(creditCard.creditCardId);
      }

      if (!isCreditCard && isHaveingPermission.length < 0) {
        return res.status(400).json({
          message: "No credit cards attached",
        });
      }

      return res.status(200).send({
        message: "Success",
        data: isCreditCard,
        allowedData,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteCreditCard: async (req: Request, res: Response, next: any) => {
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
      const isCreditCard = await CreditCardRepo.createQueryBuilder("creditCard")
        .innerJoin("creditCard.userProfile", "userProfile")
        .where("creditCard.id = :id", { id: id })
        .andWhere("userProfile.id = :userProfileId", {
          userProfileId: userProfile.id,
        })
        .getOne();

      if (!isCreditCard) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      await CreditCardRepo.delete({ id: parseInt(id) });

      return res.status(200).send({
        message: "Delete Successfull",
      });
    } catch (error) {
      next(error);
    }
  },
  renameCreditCard: async (req: Request, res: Response, next: any) => {
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

      const isCreditCard = await CreditCardRepo.createQueryBuilder("creditCard")
        .where("creditCard.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("creditCard.id = :id", { id: id })
        .getOne();

      if (!isCreditCard) {
        return res.status(400).json({
          message: "No Credit Card attached",
        });
      }

      isCreditCard.name = req.body.name;

      CreditCardRepo.save(isCreditCard as any);

      return res.status(200).send({
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  getCreditCardDetailsById: async (req: Request, res: Response, next: any) => {
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

      const isCreditCard = await CreditCardRepo.createQueryBuilder("creditCard")
        .where("creditCard.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("creditCard.id = :id", { id: id })
        .getOne();

      const isHaveingPermission = await PermissionRepo.findOne({
        where: {
          creditCardId: { id: id as any },
          buddy: { id: req.user as any },
          form_type:
            PERMISSION_FORM_TYPE_ENUMS.CREDIT_CARD_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "creditCardId"],
      });

      if (!isCreditCard && !isHaveingPermission) {
        return res.status(400).json({
          message: "No Credit Cards attached",
        });
      }

      return res.status(200).send({
        message: "Success",
        allowedData: isHaveingPermission?.creditCardId,
        data: isCreditCard,
      });
    } catch (error) {
      next(error);
    }
  },

  updateCreditCardById: async (req: Request, res: Response, next: any) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const requiredFields = [
        "credit_card_name",
        "website",
        "user_name",
        "password",
        "credit_card_number",
        "payment_date",
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
          .json({ success: false, message: "No Bank Account to display" });
      }

      const isCreditCard = await CreditCardRepo.createQueryBuilder("creditCard")
        .where("creditCard.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("creditCard.id = :id", { id: id })
        .getOne();

      if (!isCreditCard) {
        return res.status(400).json({
          message: "No bank account attached",
        });
      }
      isCreditCard.credit_card_name = data?.credit_card_name;
      isCreditCard.website = data?.website;
      isCreditCard.user_name = data?.user_name;
      isCreditCard.password = data?.password;
      isCreditCard.credit_card_number = data?.credit_card_number;
      isCreditCard.payment_date = `${new Date(data.payment_date)}`;
      isCreditCard.account_nick_name = data?.account_nick_name;

      await CreditCardRepo.save(isCreditCard);

      return res.status(200).send({
        message: " Updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
