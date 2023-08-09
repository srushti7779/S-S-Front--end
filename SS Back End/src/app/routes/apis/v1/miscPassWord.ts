import { Router } from "express";

import { bankAccountController } from "../../../controllers/apis/v1/bankAccount";
import { authenticateUser } from "../../../../middlewares/verifyUsers";
import { passwordStorageController } from "../../../controllers/apis/v1/passwordStorage";
import { miscPasswordController } from "../../../controllers/apis/v1/miscPassword";

const router = Router();

router.use(authenticateUser);
router.post("/", miscPasswordController.postMiscPassword);
router.get("/", miscPasswordController.getMiscPassword);
router.delete("/:id", miscPasswordController.deleteMiscPassword);
router.get("/:id", miscPasswordController.getMiscPasswordDetailsById);
router.put("/:id", miscPasswordController.updateMiscPasswordDetailsById);
router.put("/rename/:id", miscPasswordController.renameMiscAccount);

export default router;
