import { Router } from "express";

import { bankAccountController } from "../../../controllers/apis/v1/bankAccount";
import { authenticateUser } from "../../../../middlewares/verifyUsers";
import { passwordStorageController } from "../../../controllers/apis/v1/passwordStorage";

const router = Router();

router.use(authenticateUser);
router.post("/", passwordStorageController.postPasswordStorage);
router.get("/", passwordStorageController.getPasswordStorage);
router.delete("/:id", passwordStorageController.deletePasswordStorage);
router.get("/:id", passwordStorageController.getPasswordStorageDetailsById);
router.put("/:id", passwordStorageController.updatePasswordStorageDetailsById);
router.put("/rename/:id", passwordStorageController.renameMiscAccount);
// router.get('/user', authController.getUser);

export default router;
