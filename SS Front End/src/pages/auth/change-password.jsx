import SSButton from "@/components/form/SSButton";
import SSInput from "@/components/form/SSInput";
import { Form, Formik } from "formik";
import Image from "next/image";
import React from "react";
import EmailStartEndornment from "../../assests/images/Email.png";
import PasswordStartEndornment from "../../assests/images/password.png";
import Logo from "../../assests/logos/Logo.svg";
import {
  authUserChangePassword,
  authUserForgotPassword,
} from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({
    loading: state.userAuth.loading,
  }));
  return (
    <div className="max-w-[652px] w-full bg-white rounded-[20px] bg- mx-auto my-20 p-10 md:p-[70px] relative">
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirm_password: "",
          otp: "",
        }}
        enableReinitialize
        onSubmit={(values) => {
          if (values.password !== values.confirm_password) {
            return toast.error("Password does not match");
          }
          const data = {
            email: localStorage.getItem("user_email"),
            password: values.password,
            otp: values.otp,
          };
          dispatch(authUserChangePassword(data));
        }}
      >
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex justify-center  bg-white items-center z-20 -top-10 left-[35%] md:left-[41%] absolute w-[110px] h-[110px] border-[14px] border-[#FAFAFA] rounded-full">
              <Image priority src={Logo} alt="" />
            </div>
            <div className="py-[30px] flex flex-col justify-center items-center">
              <h2 className="font-semibold text-[32px]">Change Password</h2>
            </div>
            <div>
              <SSInput
                label="Email"
                type="email"
                name="email"
                value={process.browser && localStorage.getItem("user_email")}
                placeholder="Enter your email"
                StartIcon={
                  <Image
                    src={EmailStartEndornment}
                    className="w-[50px] h-[45px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
                    alt=""
                  />
                }
                disabled={true}
                error={!!errors?.email || false}
                errorMessage={errors?.email}
              />
            </div>
            <div className="my-10">
              <SSInput
                label="OTP"
                type="text"
                name="otp"
                placeholder="Enter your otp "
                StartIcon={
                  <Image
                    src={PasswordStartEndornment}
                    className="w-[50px] h-[45px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
                    alt=""
                  />
                }
                error={!!errors?.email || false}
                errorMessage={errors?.email}
              />
            </div>
            <div className="my-10">
              <SSInput
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your Password "
                StartIcon={
                  <Image
                    src={PasswordStartEndornment}
                    className="w-[50px] h-[45px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
                    alt=""
                  />
                }
                error={!!errors?.email || false}
                errorMessage={errors?.email}
              />
            </div>
            <div className="my-10">
              <SSInput
                label="Confirm Password"
                type="password"
                name="confirm_password"
                placeholder="Enter your password "
                StartIcon={
                  <Image
                    src={PasswordStartEndornment}
                    className="w-[50px] h-[45px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
                    alt=""
                  />
                }
                error={!!errors?.email || false}
                errorMessage={errors?.email}
              />
            </div>
            <div className="mx-auto w-full mt-10">
              <SSButton
                type="submit"
                isLoading={loading}
                className="w-[250px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer mx-auto"
              >
                Submit
              </SSButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
