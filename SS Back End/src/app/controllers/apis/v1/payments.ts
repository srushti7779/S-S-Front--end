import { Response } from "express";
import { AppDataSource, stripe } from "../../../../config";
import { Request } from "../../../../utils/@types";
import generateUid from "../../../../utils/crypto";
import { UserAuth } from "../../../models/UserAuth";
import PlanActivity from "../../../models/planActivity";
import fs from "fs";
import https from "https";

const UserAuthRepo = AppDataSource.getRepository(UserAuth);
const PlansActivityRepo = AppDataSource.getRepository(PlanActivity);

export const paymentController = {
  createPaymentIntent: async (req: Request, res: Response) => {
    try {
      const user = await UserAuthRepo.findOne({
        where: {
          id: req.user as any,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const paymentMethod = req.body.paymentMethod;
      const customer = await stripe.customers.create({
        payment_method: paymentMethod,
        email: user.email,
        invoice_settings: {
          default_payment_method: paymentMethod,
        },
      });

      user.customerId = customer.id;
      await UserAuthRepo.save(user);

      const subscription = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer: customer.id,
        line_items: [{ price: req.body.priceId, quantity: 1 }],
        success_url: `${process.env.CLIENT_URL}/completion?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancle`,
      });

      res.status(200).json({ subscription });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ success: false, message: "Internal server error" });
    }
  },

  verifySessionId: async (req: Request, res: Response) => {
    const { session_id } = req.query;
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const isActivity: any = await PlansActivityRepo.findOne({
        where: {
          user: { id: req.user as any },
          isPlanActive: false,
        },
        relations: ["user"],
      });
      if (!isActivity) {
        return res.status(400).send({ message: "No user found " });
      }
      if (session.payment_status === "paid") {
        isActivity.isPlanActive = true;
        await PlansActivityRepo.save(isActivity);
        res.status(200).send("Payment completed successfully.");
      } else {
        res.status(400).send("Payment failed.");
      }
    } catch (error) {
      console.error("Error retrieving session:", error);
      res.status(500).send("An error occurred while retrieving the session.");
    }
  },

  sendPublishableKey: async (req: Request, res: Response) => {
    try {
      res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_TEST_KEY,
      });
    } catch (error) {
      res.status(400).send({
        message: "Something went wrong",
      });
    }
  },

  getTransactionList: async (req: Request, res: Response) => {
    try {
      const user = await UserAuthRepo.findOne({
        where: {
          id: req.user as any,
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "User dosent exists",
        });
      }

      const transactions = await stripe.charges.list({
        customer: user.customerId,
        limit: 10,
      });

      return res.status(200).json({
        message: "Success",
        data: transactions,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  },

  getInvoiceDetails: async (req: Request, res: Response) => {
    try {
      const invoiceId = req.params.id;

      const invoice = await stripe.invoices.retrieve(invoiceId);
      const invoiceUrl = invoice.invoice_pdf;

      const request = https.get(invoiceUrl, function (response) {
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=invoice.pdf"
        );
        response.pipe(res);
      });

      request.on("error", function (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to download invoice" });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve invoice" });
    }
  },
};
