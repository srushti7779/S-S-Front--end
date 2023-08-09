import { AppDataSource } from "../../../../config";
import { Response } from "express";
import { Request } from "../../../../utils/@types";
import PlanActivity from "../../../models/planActivity";
import { UserProfile } from "../../../models/UserProfile";

const PlanActivityRepo = AppDataSource.getRepository(PlanActivity);
const ProfileRepo = AppDataSource.getRepository(UserProfile);

export const planActivityController = {
  getPlanActivity: async (req: Request, res: Response) => {
    try {
      const getPlan = await PlanActivityRepo.findOne({
        where: {
          user: { id: req.user as any },
        },
      });

      if (!getPlan) {
        return res.status(400).send({
          message: "Please subscribe a plan to continue",
        });
      }

      return res.status(200).send({ data: getPlan });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  },

  setPlanActivityForTheUser: async (req: Request, res: Response) => {
    try {
      const { title, storage, buddies, ...data } = req.body;

      const isNewPlan = await PlanActivityRepo.findOne({
        where: {
          user: { id: req.user as any },
          isPlanActive: true,
        },
      });

      if (isNewPlan) {
        return res.status(400).send({
          message: "Already have a plan",
        });
      }

      const newPlanActivity = new PlanActivity();
      newPlanActivity.title = title;
      newPlanActivity.storage = storage;
      newPlanActivity.buddies = buddies;
      newPlanActivity.user = req.user as any;
      if (data.priceMonthly) {
        newPlanActivity.priceMonthly = true;
        newPlanActivity.priceYearly = false;
      } else {
        newPlanActivity.priceMonthly = false;
        newPlanActivity.priceYearly = true;
      }

      PlanActivityRepo.save(newPlanActivity);

      return res.status(200).send({
        message: "Plan upgraded successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: "Internal Server errro",
      });
    }
  },

  updatePlanActivityForTheUser: async (req: Request, res: Response) => {
    try {
      const data = req.body;

      PlanActivityRepo.update(data, {
        user: { id: req.user as any },
      });

      return res.status(200).send({
        message: "Plan upgraded successfully",
      });
    } catch (error) {
      return res.status(400).json({
        message: "Internal Server errro",
      });
    }
  },
};
