import { Router } from "express";
import { uploadFile } from "../../../../config";
import { authenticateUser } from "../../../../middlewares/verifyUsers";
import { planActivityController } from "../../../controllers/apis/v1/planAcitivity";

const router = Router();

router.use(authenticateUser);
router
  .route("/")
  .post(planActivityController.setPlanActivityForTheUser)
  .get(planActivityController.getPlanActivity)
  .put(planActivityController.updatePlanActivityForTheUser);

export default router;
