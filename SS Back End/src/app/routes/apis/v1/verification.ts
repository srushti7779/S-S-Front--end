import { Router } from "express";
import { uploadFile } from "../../../../config";
import { authenticateUser } from "../../../../middlewares/verifyUsers";
import { verificationController } from "../../../controllers/apis/v1/verification";

const router = Router();

router.use(authenticateUser);
router.route("/").get(verificationController.update);

// router.get('/user', authController.getUser);

export default router;
