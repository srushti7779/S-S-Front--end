import { Response } from "express";
import { Request } from "../../../../utils/@types";
import bcrypt from "bcrypt";
import { AppDataSource } from "../../../../config";
import { UserProfile } from "../../../models/UserProfile";
import RecipeForm from "../../../models/RecipeForm";
import { Permission } from "../../../models/permissions";
import { PERMISSION_FORM_TYPE_ENUMS } from "../../../../utils/helper";
// import RecipeForm from "../../../models/RecipeFormForm";

const PermissionRepo = AppDataSource.getRepository(Permission);
const RecipeFormRepo = AppDataSource.getRepository(RecipeForm);
const UserProfileRepo = AppDataSource.getRepository(UserProfile);

export const recipeFormController = {
  postRecipeForm: async (req: Request, res: Response, next: any) => {
    try {
      const { recipe_name, ...data } = req.body;
      const requiredFields = ["recipe_name"];

      for (let i = 0; i < requiredFields.length; i++) {
        if (!req.body[requiredFields[i]]) {
          return res.status(400).send({
            code: 400,
            message: "Please fill all required fields " + requiredFields[i],
          });
        }
      }

      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      const newRecipeForm = new RecipeForm();
      newRecipeForm.userProfile = userProfile?.id as any;
      newRecipeForm.recipe_name = data?.recipe_name;
      newRecipeForm.ingredient_one = data?.ingredient_one;
      newRecipeForm.ingredient_one_amount = data?.ingredient_one_amount;
      newRecipeForm.ingredient_one_amount_type =
        data?.ingredient_one_amount_type;
      newRecipeForm.ingredient_two = data?.ingredient_two;
      newRecipeForm.ingredient_two_amount = data?.ingredient_two_amount;
      newRecipeForm.ingredient_two_amount_type =
        data?.ingredient_two_amount_type;
      newRecipeForm.ingredient_three = data?.ingredient_three;
      newRecipeForm.ingredient_three_amount = data?.ingredient_three_amount;
      newRecipeForm.ingredient_three_amount_type =
        data?.ingredient_three_amount_type;
      newRecipeForm.ingredient_four = data?.ingredient_four;
      newRecipeForm.ingredient_four_amount = data?.ingredient_four_amount;
      newRecipeForm.ingredient_four_amount_type =
        data?.ingredient_four_amount_type;
      newRecipeForm.ingredient_five = data?.ingredient_five;
      newRecipeForm.ingredient_five_amount = data?.ingredient_five_amount;
      newRecipeForm.ingredient_five_amount_type =
        data?.ingredient_five_amount_type;
      newRecipeForm.ingredient_six = data?.ingredient_six;
      newRecipeForm.ingredient_six_amount = data?.ingredient_six_amount;
      newRecipeForm.ingredient_six_amount_type =
        data?.ingredient_six_amount_type;
      newRecipeForm.ingredient_seven_amount = data?.ingredient_seven_amount;
      newRecipeForm.ingredient_seven = data?.ingredient_seven;
      newRecipeForm.ingredient_seven_amount_type =
        data?.ingredient_seven_amount_type;
      newRecipeForm.cooking_description = data?.cooking_description;

      await RecipeFormRepo.save(newRecipeForm);

      return res.status(200).json({
        message: "Saved Successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getRecipeForm: async (req: Request, res: Response, next: any) => {
    try {
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res.status(200).json({
          success: false,
          message: "No data to display",
        });
      }
      const isRecipeForm = await RecipeFormRepo.createQueryBuilder("recipeForm")
        .where("recipeForm.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .getMany();

      const isHaveingPermission = await PermissionRepo.find({
        where: {
          buddy: { id: req.user as any },
          timeReleaseDate: false,
          form_type: PERMISSION_FORM_TYPE_ENUMS.RECIPE_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "recipeAccountId"],
      });
      const allowedData = [];
      for (const recipeAccount of isHaveingPermission) {
        allowedData.push(recipeAccount.recipeAccountId);
      }

      if (!isRecipeForm && isHaveingPermission.length < 0) {
        return res.status(400).json({
          message: "No data attached",
        });
      }

      return res.status(200).send({
        message: "Success",
        data: isRecipeForm,
        allowedData,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteRecipeForm: async (req: Request, res: Response, next: any) => {
    try {
      const { id } = req.params;
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No Data to display" });
      }
      const isRecipeForm = await RecipeFormRepo.createQueryBuilder("recipeForm")
        .innerJoin("recipeForm.userProfile", "userProfile")
        .where("recipeForm.id = :id", { id: id })
        .andWhere("userProfile.id = :userProfileId", {
          userProfileId: userProfile.id,
        })
        .getOne();

      if (!isRecipeForm) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      await RecipeFormRepo.delete({ id: parseInt(id) });

      return res.status(200).send({
        message: "Delete Successfull",
      });
    } catch (error) {
      next(error);
    }
  },

  renameMiscAccount: async (req: Request, res: Response, next: any) => {
    try {
      if (!req.body.name) {
        return res.status(400).json({
          message: "Name is required",
        });
      }
      const { id } = req.params;
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No data to display" });
      }

      const isRecipeForm = await RecipeFormRepo.createQueryBuilder("recipeForm")
        .innerJoin("recipeForm.userProfile", "userProfile")
        .where("recipeForm.id = :id", { id: id })
        .andWhere("userProfile.id = :userProfileId", {
          userProfileId: userProfile.id,
        })
        .getOne();

      if (!isRecipeForm) {
        return res.status(400).json({
          message: "No records found",
        });
      }

      isRecipeForm.name = req.body.name;

      RecipeFormRepo.save(isRecipeForm as any);

      return res.status(200).send({
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  getRecipeFormDetailsById: async (req: Request, res: Response, next: any) => {
    try {
      const { id } = req.params;
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No Bank Account to display" });
      }

      const isRecipeForm = await RecipeFormRepo.createQueryBuilder("recipeForm")
        .where("recipeForm.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("recipeForm.id = :id", { id: id })
        .getOne();

      const isHaveingPermission = await PermissionRepo.findOne({
        where: {
          recipeAccountId: { id: id as any },
          buddy: { id: req.user as any },
          form_type: PERMISSION_FORM_TYPE_ENUMS.RECIPE_FORM_TYPE_ENUM as string,
        },
        relations: ["userAuth", "recipeAccountId"],
      });

      if (!isRecipeForm && !isHaveingPermission) {
        return res.status(400).json({
          message: "No data found",
        });
      }

      return res.status(200).send({
        message: "Success",
        allowedData: isHaveingPermission?.recipeAccountId,
        data: isRecipeForm,
      });
    } catch (error) {
      next(error);
    }
  },

  updateRecipeFormDetailsById: async (
    req: Request,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const userProfile = await UserProfileRepo.createQueryBuilder(
        "userProfile"
      )
        .innerJoinAndSelect("userProfile.userAuth", "UserAuth")
        .where("userProfile.userAuth = :id", { id: req.user })
        .getOne();

      if (!userProfile) {
        return res
          .status(200)
          .json({ success: false, message: "No data found" });
      }

      const isRecipeForm = await RecipeFormRepo.createQueryBuilder("RecipeForm")
        .where("RecipeForm.userProfile = :userProfile", {
          userProfile: userProfile?.id,
        })
        .andWhere("RecipeForm.id = :id", { id: id })
        .getOne();

      if (!isRecipeForm) {
        return res.status(400).json({
          message: "No data found",
        });
      }
      isRecipeForm.recipe_name = data?.recipe_name;
      isRecipeForm.ingredient_one = data?.ingredient_one;
      isRecipeForm.ingredient_one_amount = data?.ingredient_one_amount;
      isRecipeForm.ingredient_one_amount_type =
        data?.ingredient_one_amount_type;
      isRecipeForm.ingredient_two = data?.ingredient_two;
      isRecipeForm.ingredient_two_amount = data?.ingredient_two_amount;
      isRecipeForm.ingredient_two_amount_type =
        data?.ingredient_two_amount_type;
      isRecipeForm.ingredient_three = data?.ingredient_three;
      isRecipeForm.ingredient_three_amount = data?.ingredient_three_amount;
      isRecipeForm.ingredient_three_amount_type =
        data?.ingredient_three_amount_type;
      isRecipeForm.ingredient_four = data?.ingredient_four;
      isRecipeForm.ingredient_four_amount = data?.ingredient_four_amount;
      isRecipeForm.ingredient_four_amount_type =
        data?.ingredient_four_amount_type;
      isRecipeForm.ingredient_five = data?.ingredient_five;
      isRecipeForm.ingredient_five_amount = data?.ingredient_five_amount;
      isRecipeForm.ingredient_five_amount_type =
        data?.ingredient_five_amount_type;
      isRecipeForm.ingredient_six = data?.ingredient_six;
      isRecipeForm.ingredient_six_amount = data?.ingredient_six_amount;
      isRecipeForm.ingredient_six_amount_type =
        data?.ingredient_six_amount_type;
      isRecipeForm.ingredient_seven_amount = data?.ingredient_seven_amount;
      isRecipeForm.ingredient_seven = data?.ingredient_seven;
      isRecipeForm.ingredient_seven_amount_type =
        data?.ingredient_seven_amount_type;
      isRecipeForm.cooking_description = data?.cooking_description;

      await RecipeFormRepo.save(isRecipeForm);

      return res.status(200).send({
        message: " Updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
