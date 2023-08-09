import SSInput from "@/components/form/SSInput";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import Logo from "../../assests/logos/Logo.svg";
import EmailStartEndornment from "../../assests/images/Email.png";
import PasswordStartEndornment from "../../assests/images/password.png";
import GoogleLogo from "../../assests/logos/Google.png";
import FacebookLogo from "../../assests/logos/Facebook.png";
import AppleLogo from "../../assests/logos/Apple.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { CheckIcon } from "@heroicons/react/20/solid";
import SSButton from "@/components/form/SSButton";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { authUserLogin, authUserRegister } from "@/redux/slices/authSlice";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SignUpFormValidations } from "@/utils/validator";

const SignUp = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [phonenumber, setPhoneNumber] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({
    loading: state.userAuth.loading,
  }));

  return (
    <div className="max-w-[652px] bg-white rounded-[20px] bg- mx-auto my-10 p-10 md:p-[70px] relative">
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
        }}
        validationSchema={SignUpFormValidations}
        enableReinitialize
        onSubmit={(values) => {
          if (!checked) {
            return toast.error(
              "Please accept the Terms and Conditions before making an account"
            );
          }
          const formValue = {
            ...values,
            email: values.email.toLocaleLowerCase(),
          };
          dispatch(authUserRegister(formValue));
        }}
      >
        {({ errors, touched, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex justify-center  bg-white items-center z-10 -top-10 left-[41%] absolute w-[110px] h-[110px] border-[14px] border-[#FAFAFA] rounded-full">
              <Image priority src={Logo} alt="logo" />
            </div>
            <div className="py-[30px] flex flex-col justify-center items-center">
              <h2 className="font-semibold text-[32px]">Sign Up</h2>
            </div>
            <div>
              <SSInput
                label="Username"
                type="text"
                name="name"
                placeholder="Enter your name here"
                StartIcon={
                  <Image
                    src={EmailStartEndornment}
                    className="w-[50px] h-[40px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
                    alt="image"
                  />
                }
                error={!!errors?.name || false}
                errorMessage={errors?.name}
              />
            </div>
            <div className="my-5">
              <SSInput
                label="Email"
                type="text"
                name="email"
                placeholder="Enter your email here"
                StartIcon={
                  <Image
                    src={EmailStartEndornment}
                    className="w-[50px] h-[40px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
                    alt="image"
                  />
                }
                error={!!errors?.email || false}
                errorMessage={errors?.email}
              />
            </div>
            <div className="my-5">
              <SSInput
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password here"
                StartIcon={
                  <Image
                    src={PasswordStartEndornment}
                    className="w-[50px] h-[40px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
                    alt="image"
                  />
                }
                error={!!errors?.password || false}
                errorMessage={errors?.password}
              />
            </div>
            <div className="my-5">
              <label
                className={"block font-medium text-xl leading-[30px] mb-[7px]"}
              >
                Phone Number
              </label>
              <PhoneInput
                label="Phone Number"
                country={"us"}
                value={phone}
                onChange={(event) => {
                  setPhone(`+${event}`);
                  setFieldValue("phoneNumber", `+${event}`);
                }}
                dropdownStyle={{
                  transform: "translateY(-15px) translateX(15px)",
                  border: "none",
                }}
                fullWidth="true"
                disableSearchIcon="true"
                placeholder="Enter your phone number here"
                onFocus={() => setPhoneNumber(true)}
                onBlur={() => setPhoneNumber(false)}
                buttonClass="button"
                inputClass="input"
                inputStyle={{
                  border:
                    errors && errors.phoneNumber
                      ? "1px solid red"
                      : "1px solid black",
                  width: "100%",
                  height: "50px",
                  paddingLeft: "50px",
                  paddingRight: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                  borderRadius: "10px",
                }}
              />
              {errors && errors.phoneNumber && (
                <p className={"text-xs  font-medium text-red-500"}>
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className="text-base">
                  I have read the{" "}
                  <Link href="/tnc" className="cursor-pointer text-[#0000F1]">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="privacy-policy"
                    className="cursor-pointer text-[#0000F1]"
                  >
                    Privacy Policy
                  </Link>
                </span>
                <input
                  type="checkbox"
                  className="form-checkbox hidden h-5 w-5 text-indigo-600"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
                <div
                  className={`w-6 h-6 rounded-md border-[2px] flex justify-center items-center cursor-pointer ${
                    checked ? "bg-[#00A652]" : "bg-white"
                  }`}
                >
                  {checked && (
                    <CheckIcon
                      className="h-4 w-4 text-white"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </label>
            </div>
            <div className="mx-auto w-full mt-10">
              <SSButton
                type="submit"
                isLoading={loading}
                className="w-[154px] h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer mx-auto"
              >
                Sign Up
              </SSButton>
            </div>
            <div className="mt-10 text-center">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-[#00000080]"
              >
                Login
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
