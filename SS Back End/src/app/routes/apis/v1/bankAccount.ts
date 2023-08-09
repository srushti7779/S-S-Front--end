import { Router } from "express";

import { bankAccountController } from "../../../controllers/apis/v1/bankAccount";
import { authenticateUser } from "../../../../middlewares/verifyUsers";

const router = Router();

router.use(authenticateUser);
router.post("/", bankAccountController.postBankAccount);
router.get("/", bankAccountController.getBankAccount);
router.delete("/:id", bankAccountController.deleteBankAccount);
router.get("/:id", bankAccountController.getBankAccountDetailsById);
router.put("/:id", bankAccountController.updateBankAccountDetailsById);
router.put("/rename/:id", bankAccountController.renameBankAccount);

export default router;
