import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import SSInput from "../form/SSInput";
import SSButton from "../form/SSButton";
import { useDispatch, useSelector } from "react-redux";
import {
  getPasswordFormData,
  postPasswordForm,
  putPasswordForm,
} from "@/redux/slices/passwordTypeFormSlice";
import { useRouter } from "next/router";

const MiscAccountForm = ({ isEdit, id, formType }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading } = useSelector((state) => ({
    loading: state.passwordFormSlice.loading,
  }));
  const [getMiscAccount, setMiscAccount] = useState();
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
          setMiscAccount(res?.data);
          setAllowedData(res?.allowedData);
          setIsData(true);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  return (
    <div className="max-w-[550px] py-5 px-8 w-full mx-auto bg-white mt-10 rounded-[10px] flex justify-center items-center">
      <Formik
        initialValues={{
          account_name:
            getMiscAccount?.account_name || getAllowedData?.account_name || "",
          website: getMiscAccount?.website || getAllowedData?.website || "",
          user_name:
            getMiscAccount?.user_name || getAllowedData?.user_name || "",
          password: getMiscAccount?.password || getAllowedData?.password || "",
          account_number:
            getMiscAccount?.account_number ||
            getAllowedData?.account_number ||
            "",
          account_nick_name:
            getMiscAccount?.account_nick_name ||
            getAllowedData?.account_nick_name ||
            "",
        }}
        enableReinitialize
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
            className="flex flex-col justify-center items-center gap-4"
          >
            <h1 className="text-[32px] text-center font-bold">
              Misc Account Password Storage Form
            </h1>
            <SSInput
              label="Account Name:"
              type="text"
              placeholder="Enter account name"
              name="account_name"
              labelClassName="text-base"
              disabled={(isEdit && !isProfileEdit) || getAllowedData}
            />
            <SSInput
              label="Website/URL"
              type="text"
              placeholder="Enter your website"
              name="website"
              disabled={(isEdit && !isProfileEdit) || getAllowedData}
              labelClassName="text-base"
            />
            <SSInput
              label="User Name:"
              type="text"
              placeholder="Enter username"
              labelClassName="text-base"
              disabled={(isEdit && !isProfileEdit) || getAllowedData}
              name="user_name"
            />
            <SSInput
              label="Password:"
              type="password"
              placeholder="Enter password"
              name="password"
              disabled={(isEdit && !isProfileEdit) || getAllowedData}
              labelClassName="text-base"
            />
            <SSInput
              label="Account:"
              type="tel"
              placeholder="Enter account number"
              name="account_number"
              disabled={(isEdit && !isProfileEdit) || getAllowedData}
              labelClassName="text-base"
            />
            <SSInput
              label="Account Nick Name:"
              type="text"
              labelClassName="text-base"
              placeholder="Enter account nickname"
              disabled={(isEdit && !isProfileEdit) || getAllowedData}
              name="account_nick_name"
            />
            <div>
              <label className="block font-medium text-base leading-[30px]">
                Password Recovery:
              </label>
              <p>
                We do not recommend storing questions and answers to recover
                your password. Please reset your password instead for added
                security.
              </p>
            </div>
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

export default MiscAccountForm;
