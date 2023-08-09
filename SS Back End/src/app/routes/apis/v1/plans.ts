import { Router } from "express";
import { authenticateAdminUser } from "../../../../middlewares/verifyUsers";

import { plansController } from "../../../controllers/apis/v1/plans";

const router = Router();

router.get("/", plansController.getProductsList);
router.get("/:id", plansController.getPlan);

router.use(authenticateAdminUser);
router.post("/", plansController.createPlans);
router
  .route("/:id")
  .put(plansController.updatePlan)
  .delete(plansController.deletePlan);

// router.get('/user', authController.getUser);

export default router;
