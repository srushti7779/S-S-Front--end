import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import SSInput from "../form/SSInput";
import SSButton from "../form/SSButton";
import { useDispatch, useSelector } from "react-redux";
import SSSelect from "../form/SSSelect";
import {
  getPasswordFormData,
  postPasswordForm,
  putPasswordForm,
} from "@/redux/slices/passwordTypeFormSlice";
import { useRouter } from "next/router";

const PasswordSelectNames = [
  { id: 1, name: "Tea spoon", label: "Tea spoon" },
  { id: 2, name: "Table spoon", label: "Table spoon" },
  { id: 3, name: "Ounce", label: "Ounce" },
  { id: 4, name: "Cup", label: "Cup" },
  { id: 5, name: "Liter(s)", label: "Liter(s)" },
  { id: 6, name: "Pound(s)", label: "Pound(s)" },
];

const RecipeForm = ({ isEdit, id, formType }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => ({
    loading: state.passwordFormSlice.loading,
  }));
  const [getMerchantAccount, setMerchantAccount] = useState();
  const [getAllowedData, setAllowedData] = useState();
  const [isData, setIsData] = useState(true);
  const [isProfileEdit, setIsProfileEdit] = useState(false);

  useEffect(() => {
    if (id && isEdit) {
      dispatch(getPasswordFormData({ formType, id }))
        .unwrap()
        .then((res) => {
          if (!res.data && !res.allowedData) {
            return router.push("/404");
          }
          setMerchantAccount(res?.data);
          setAllowedData(res?.allowedData);
          setIsData(true);
        })
        .catch((e) => console.log(e));
    }
  }, []);
  return (
    <div className="max-w-[550px] py-5 px-8 w-full mx-auto bg-white mt-10 rounded-[10px] flex justify-center items-center">
      <Formik
        enableReinitialize
        initialValues={{
          recipe_name:
            getMerchantAccount?.recipe_name ||
            getAllowedData?.recipe_name ||
            "",
          ingredient_one:
            getMerchantAccount?.ingredient_one ||
            getAllowedData?.ingredient_one ||
            "",
          ingredient_one_amount:
            getMerchantAccount?.ingredient_one_amount ||
            getAllowedData?.ingredient_one_amount ||
            "",
          ingredient_one_amount_type:
            getMerchantAccount?.ingredient_one_amount_type ||
            getAllowedData?.ingredient_one_amount_type ||
            "",
          ingredient_two:
            getMerchantAccount?.ingredient_two ||
            getAllowedData?.ingredient_two ||
            "",
          ingredient_two_amount:
            getMerchantAccount?.ingredient_two_amount ||
            getAllowedData?.ingredient_two_amount ||
            "",
          ingredient_two_amount_type:
            getMerchantAccount?.ingredient_two_amount_type ||
            getAllowedData?.ingredient_two_amount_type ||
            "",
          ingredient_three:
            getMerchantAccount?.ingredient_three ||
            getAllowedData?.ingredient_three ||
            "",
          ingredient_three_amount:
            getMerchantAccount?.ingredient_three_amount ||
            getAllowedData?.ingredient_three_amount ||
            "",
          ingredient_three_amount_type:
            getMerchantAccount?.ingredient_three_amount_type ||
            getAllowedData?.ingredient_three_amount_type ||
            "",
          ingredient_four:
            getMerchantAccount?.ingredient_four ||
            getAllowedData?.ingredient_four ||
            "",
          ingredient_four_amount:
            getMerchantAccount?.ingredient_four_amount ||
            getAllowedData?.ingredient_four_amount ||
            "",
          ingredient_four_amount_type:
            getMerchantAccount?.ingredient_four_amount_type ||
            getAllowedData?.ingredient_four_amount_type ||
            "",
          ingredient_five:
            getMerchantAccount?.ingredient_five ||
            getAllowedData?.ingredient_five ||
            "",
          ingredient_five_amount:
            getMerchantAccount?.ingredient_five_amount ||
            getAllowedData?.ingredient_five_amount ||
            "",
          ingredient_five_amount_type:
            getMerchantAccount?.ingredient_five_amount_type ||
            getAllowedData?.ingredient_five_amount_type ||
            "",
          ingredient_six:
            getMerchantAccount?.ingredient_six ||
            getAllowedData?.ingredient_six ||
            "",
          ingredient_six_amount:
            getMerchantAccount?.ingredient_six_amount ||
            getAllowedData?.ingredient_six_amount ||
            "",
          ingredient_six_amount_type:
            getMerchantAccount?.ingredient_six_amount_type ||
            getAllowedData?.ingredient_six_amount_type ||
            "",
          ingredient_seven:
            getMerchantAccount?.ingredient_seven ||
            getAllowedData?.ingredient_seven ||
            "",
          ingredient_seven_amount:
            getMerchantAccount?.ingredient_seven_amount ||
            getAllowedData?.ingredient_seven_amount ||
            "",
          ingredient_seven_amount_type:
            getMerchantAccount?.ingredient_seven_amount_type ||
            getAllowedData?.ingredient_seven_amount_type ||
            "",
          cooking_description:
            getMerchantAccount?.cooking_description ||
            getAllowedData?.cooking_description ||
            "",
        }}
        onSubmit={(values) => {
          if (getAllowedData) {
            return;
          }
          if (id && isEdit) {
            setIsProfileEdit(!isProfileEdit);
            if (!isProfileEdit) return null;
            dispatch(putPasswordForm({ formType, id, ...values }));
          } else {
            dispatch(postPasswordForm({ formType, ...values }));
          }
        }}
      >
        {({ errors, touched, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center w-full items-center gap-4"
          >
            <h1 className="text-[32px] text-center font-bold">
              Recipe Storage Form
            </h1>
            <div className="w-full">
              <SSInput
                type="text"
                label="Enter Recipe Name"
                name="recipe_name"
                disabled={(isEdit && !isProfileEdit) || getAllowedData}
                placeholder="Enter Recipe Name"
              />
            </div>

            <div className="w-full">
              <div className="w-full">
                <SSInput
                  label="Ingredient 1"
                  type="text"
                  disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  name="ingredient_one"
                  placeholder="Enter Ingredient 1"
                />
              </div>
              <div className="w-full">
                <div className="relative max-w-[512px] mx-auto w-full my-10">
                  <div className="w-full mb-4">
                    <SSInput
                      label="Amount"
                      type="text"
                      disabled={(isEdit && !isProfileEdit) || getAllowedData}
                      name="ingredient_one_amount"
                      placeholder="Enter amount"
                    />
                  </div>
                  <SSSelect
                    name="ingredient_one_amount_type"
                    options={PasswordSelectNames}
                    fieldTitle="name"
                    fieldValue="label"
                    boxSize="w-full h-[50px]"
                    labelClassName="text-black"
                    label="Select Type"
                    isLabelInMiddle
                    defaultValues={
                      getMerchantAccount?.ingredient_one_amount_type ||
                      getAllowedData?.ingredient_one_amount_type
                    }
                    disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full">
                <SSInput
                  label="Ingredient 2"
                  type="text"
                  disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  name="ingredient_two"
                  placeholder="Enter Ingredient 2"
                />
              </div>
              <div className="w-full">
                <div className="relative max-w-[512px] mx-auto w-full my-10">
                  <div className="w-full mb-4">
                    <SSInput
                      label="Amount"
                      type="text"
                      disabled={(isEdit && !isProfileEdit) || getAllowedData}
                      name="ingredient_two_amount"
                      placeholder="Enter amount"
                    />
                  </div>
                  <SSSelect
                    name="ingredient_two_amount_type"
                    options={PasswordSelectNames}
                    fieldTitle="name"
                    fieldValue="label"
                    boxSize="w-full h-[50px]"
                    labelClassName="text-black"
                    isLabelInMiddle
                    label="Select Type"
                    defaultValues={
                      getMerchantAccount?.ingredient_two_amount_type ||
                      getAllowedData?.ingredient_two_amount_type
                    }
                    disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full">
                <SSInput
                  label="Ingredient 3"
                  type="text"
                  disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  name="ingredient_three"
                  placeholder="Enter Ingredient 3"
                />
              </div>
              <div className="w-full">
                <div className="relative max-w-[512px] mx-auto w-full my-10">
                  <div className="w-full mb-4">
                    <SSInput
                      label="Amount"
                      type="text"
                      disabled={(isEdit && !isProfileEdit) || getAllowedData}
                      name="ingredient_three_amount"
                      placeholder="Enter amount"
                    />
                  </div>
                  <SSSelect
                    name="ingredient_three_amount_type"
                    options={PasswordSelectNames}
                    fieldTitle="name"
                    fieldValue="label"
                    boxSize="w-full h-[50px]"
                    labelClassName="text-black"
                    label="Select Type"
                    isLabelInMiddle
                    defaultValues={
                      getMerchantAccount?.ingredient_three_amount_type ||
                      getAllowedData?.ingredient_three_amount_type
                    }
                    disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full">
                <SSInput
                  label="Ingredient 4"
                  type="text"
                  disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  name="ingredient_four"
                  placeholder="Enter Ingredient 4"
                />
              </div>
              <div className="w-full">
                <div className="relative max-w-[512px] mx-auto w-full my-10">
                  <div className="w-full mb-4">
                    <SSInput
                      label="Amount"
                      type="text"
                      disabled={(isEdit && !isProfileEdit) || getAllowedData}
                      name="ingredient_four_amount"
                      placeholder="Enter amount"
                    />
                  </div>
                  <SSSelect
                    name="ingredient_four_amount_type"
                    options={PasswordSelectNames}
                    fieldTitle="name"
                    fieldValue="label"
                    boxSize="w-full h-[50px]"
                    labelClassName="text-black"
                    label="Select Type"
                    isLabelInMiddle
                    defaultValues={
                      getMerchantAccount?.ingredient_four_amount_type ||
                      getAllowedData?.ingredient_four_amount_type
                    }
                    disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full">
                <SSInput
                  label="Ingredient 5"
                  type="text"
                  disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  name="ingredient_five"
                  placeholder="Enter Ingredient 5"
                />
              </div>
              <div className="w-full">
                <div className="relative max-w-[512px] mx-auto w-full my-10">
                  <div className="w-full mb-4">
                    <SSInput
                      label="Amount"
                      type="text"
                      disabled={(isEdit && !isProfileEdit) || getAllowedData}
                      name="ingredient_five_amount"
                      placeholder="Enter amount"
                    />
                  </div>
                  <SSSelect
                    name="ingredient_five_amount_type"
                    options={PasswordSelectNames}
                    fieldTitle="name"
                    fieldValue="label"
                    boxSize="w-full h-[50px]"
                    labelClassName="text-black"
                    label="Select Type"
                    isLabelInMiddle
                    defaultValues={
                      getMerchantAccount?.ingredient_five_amount_type ||
                      getAllowedData?.ingredient_five_amount_type
                    }
                    disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full">
                <SSInput
                  label="Ingredient 6"
                  type="text"
                  disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  name="ingredient_six"
                  placeholder="Enter Ingredient 6"
                />
              </div>
              <div className="w-full">
                <div className="relative max-w-[512px] mx-auto w-full my-10">
                  <div className="w-full mb-4">
                    <SSInput
                      label="Amount"
                      type="text"
                      disabled={(isEdit && !isProfileEdit) || getAllowedData}
                      name="ingredient_six_amount"
                      placeholder="Enter amount"
                    />
                  </div>
                  <SSSelect
                    name="ingredient_six_amount_type"
                    options={PasswordSelectNames}
                    fieldTitle="name"
                    fieldValue="label"
                    boxSize="w-full h-[50px]"
                    labelClassName="text-black"
                    label="Select Type"
                    isLabelInMiddle
                    defaultValues={
                      getMerchantAccount?.ingredient_six_amount_type ||
                      getAllowedData?.ingredient_six_amount_type
                    }
                    disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  />
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="w-full">
                <SSInput
                  label="Ingredient 7"
                  type="text"
                  disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  name="ingredient_seven"
                  placeholder="Enter Ingredient 7"
                />
              </div>
              <div className="w-full">
                <div className="relative max-w-[512px] mx-auto w-full my-10">
                  <div className="w-full mb-4">
                    <SSInput
                      label="Amount"
                      type="text"
                      disabled={(isEdit && !isProfileEdit) || getAllowedData}
                      name="ingredient_seven_amount"
                      placeholder="Enter amount"
                    />
                  </div>
                  <SSSelect
                    name="ingredient_seven_amount_type"
                    options={PasswordSelectNames}
                    fieldTitle="name"
                    fieldValue="label"
                    boxSize="w-full h-[50px]"
                    labelClassName="text-black"
                    label="Select Type"
                    isLabelInMiddle
                    defaultValues={
                      getMerchantAccount?.ingredient_seven_amount_type ||
                      getAllowedData?.ingredient_seven_amount_type
                    }
                    disabled={(isEdit && !isProfileEdit) || getAllowedData}
                  />
                </div>
              </div>
            </div>

            <SSInput
              type="textarea"
              label="Cooking Direction:"
              id="cooking_description"
              disabled={(isEdit && !isProfileEdit) || getAllowedData}
              name="cooking_description"
              cols="44"
              rows="5"
            />
            <div className="mx-auto w-full mt-5">
              <SSButton
                type="submit"
                isLoading={loading}
                disabled={getAllowedData}
                className="w-[154px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer mx-auto"
              >
                {isEdit ? (isProfileEdit ? "Update" : "Edit") : "Submit"}
              </SSButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RecipeForm;
