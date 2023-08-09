import { Router } from "express";

import { authenticateUser } from "../../../../middlewares/verifyUsers";
import { merchantAccountController } from "../../../controllers/apis/v1/merchantAccount";

const router = Router();

router.use(authenticateUser);
router.post("/", merchantAccountController.postMerchantAccount);
router.get("/", merchantAccountController.getMerchantAccount);
router.delete("/:id", merchantAccountController.deleteMerchantAccount);
router.get("/:id", merchantAccountController.getMerchantAccountDetailsById);
router.put("/:id", merchantAccountController.updateMerchantAccountDetailsById);
router.put("/rename/:id", merchantAccountController.renameMerchantAccount);
// router.get('/user', authController.getUser);

export default router;
