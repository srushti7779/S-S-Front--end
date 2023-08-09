import { Router } from "express";

import { authenticateUser } from "../../../../middlewares/verifyUsers";
import { creditCardController } from "../../../controllers/apis/v1/creditCardPassword";

const router = Router();

router.use(authenticateUser);
router.post("/", creditCardController.postCreditCard);
router.get("/", creditCardController.getCreditCard);
router.delete("/:id", creditCardController.deleteCreditCard);
router.get("/:id", creditCardController.getCreditCardDetailsById);
router.put("/:id", creditCardController.updateCreditCardById);
router.put("/rename/:id", creditCardController.renameCreditCard);
// router.get('/user', authController.getUser);

export default router;
