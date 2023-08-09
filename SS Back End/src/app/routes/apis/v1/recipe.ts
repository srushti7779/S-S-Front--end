import { Router } from "express";

import { bankAccountController } from "../../../controllers/apis/v1/bankAccount";
import { authenticateUser } from "../../../../middlewares/verifyUsers";
import { recipeFormController } from "../../../controllers/apis/v1/recipe";

const router = Router();

router.use(authenticateUser);
router.post("/", recipeFormController.postRecipeForm);
router.get("/", recipeFormController.getRecipeForm);
router.delete("/:id", recipeFormController.deleteRecipeForm);
router.get("/:id", recipeFormController.getRecipeFormDetailsById);
router.put("/:id", recipeFormController.updateRecipeFormDetailsById);
router.put("/rename/:id", recipeFormController.renameMiscAccount);
// router.get('/user', authController.getUser);

export default router;
