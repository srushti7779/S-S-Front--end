import { AppDataSource, stripe } from "../../../../config";
import { Response } from "express";
import { Request } from "../../../../utils/@types";
import Plan from "../../../models/plans";

const PlansRepo = AppDataSource.getRepository(Plan);

export const plansController = {
  getProductsList: async (req: Request, res: Response) => {
    try {
      const products = await stripe.products.list();
      res.status(200).json({ products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve products" });
    }
  },

  createPlans: async (req: Request, res: Response) => {
    try {
      const {
        title,
        storage,
        buddies,
        priceMonthly,
        priceYearly,
        discount,
        description,
        fileSizeLimit,
        files,
      } = req.body;

      const extPlan = await PlansRepo.findOne({ where: { title } });

      if (extPlan)
        return res
          .status(200)
          .json({ success: false, message: "Plan already exixsts." });

      var newPlan = new Plan();

      newPlan.title = title;
      newPlan.storage = storage;
      newPlan.buddies = buddies;
      newPlan.priceMonthly = priceMonthly;
      newPlan.priceYearly = priceYearly;
      newPlan.discount = discount;
      newPlan.description = description;
      newPlan.fileSizeLimit = fileSizeLimit;
      newPlan.files = files;
      newPlan.addedBy = req.admin!;

      const newEntity = await PlansRepo.save(newPlan);

      return res
        .status(200)
        .json({
          message: "Plan successfully added",
          success: true,
          addedPlan: newEntity,
        });
    } catch (err) {
      console.log(err);
      return res
        .status(200)
        .json({ success: false, message: "something went wrong!" });
    }
  },

  updatePlan: async (req: Request, res: Response) => {
    return res.end();
  },

  getPlan: async (req: Request, res: Response) => {
    try {
      const plan = await PlansRepo.findOne({ where: { id: req.params.id } });
      if (!plan)
        return res
          .status(200)
          .json({ success: false, message: "No Plans to display" });

      return res
        .status(200)
        .json({
          message: "Plan successfully found",
          success: true,
          plan: plan,
        });
    } catch (err) {
      console.log(err);
      return res
        .status(200)
        .json({ success: false, message: "something went wrong!" });
    }
  },

  deletePlan: async (req: Request, res: Response) => {
    return res.end();
  },
};
