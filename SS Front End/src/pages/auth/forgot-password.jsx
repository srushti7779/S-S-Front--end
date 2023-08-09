import SSButton from "@/components/form/SSButton";
import SSInput from "@/components/form/SSInput";
import { Form, Formik } from "formik";
import Image from "next/image";
import React from "react";
import EmailStartEndornment from "../../assests/images/Email.png";
import Logo from "../../assests/logos/Logo.svg";
import { authUserForgotPassword } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({
    loading: state.userAuth.loading,
  }));
  return (
    <div className="max-w-[652px] w-full bg-white rounded-[20px] bg- mx-auto my-20 py-10 px-8 md:px-[70px] md:py-[70px] relative">
      <Formik
        initialValues={{ email: "" }}
        enableReinitialize
        onSubmit={(values) => {
          const formValue = {
            ...values,
            email: values.email.toLocaleLowerCase(),
          };
          dispatch(authUserForgotPassword(formValue))
            .unwrap()
            .then(() => localStorage.setItem("user_email", formValue.email));
        }}
      >
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex justify-center  bg-white items-center z-20 -top-10 left-[41%] absolute w-[110px] h-[110px] border-[14px] border-[#FAFAFA] rounded-full">
              <Image priority src={Logo} />
            </div>
            <div className="py-[30px] flex flex-col justify-center items-center">
              <h2 className="font-semibold text-[32px]">Forgot Password</h2>
            </div>
            <div className="w-full mx-auto">
              <p className="font-normal mx-auto text-base max-w-[250px] my-5 text-center">
                Please enter the email address you used to register
              </p>
            </div>
            <div>
              <SSInput
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email here"
                StartIcon={
                  <Image
                    src={EmailStartEndornment}
                    className="w-[50px] h-[40px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
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

export default ForgotPassword;
