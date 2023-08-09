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
import { authUserGoogleLogin, authUserLogin } from "@/redux/slices/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import AppleLogin from "react-apple-login";
import { LoginFormValdations } from "@/utils/validator";

const Login = () => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({
    loading: state.userAuth.loading,
  }));
  const login = useGoogleLogin({
    onSuccess: (codeResponse) =>
      dispatch(authUserGoogleLogin({ credential: codeResponse })),
    flow: "auth-code",
  });

  const responseFacebook = (response) => {
    console.log(response);
  };

  const handleAppleLogin = (response) => {
    console.log(response);
  };
  return (
    <div className="max-w-[652px] bg-white rounded-[20px] bg- mx-auto my-10 p-9  lg:p-[70px] relative">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginFormValdations}
        enableReinitialize
        onSubmit={(values) => {
          const formValue = {
            ...values,
            email: values.email.toLocaleLowerCase(),
          };
          dispatch(authUserLogin(formValue));
        }}
      >
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="flex justify-center  bg-white items-center z-10 -top-10 left-[41%] absolute w-[110px] h-[110px] border-[14px] border-[#FAFAFA] rounded-full">
              <Image priority src={Logo} alt="logo" />
            </div>
            <div className="py-[30px] flex flex-col justify-center items-center">
              <h2 className="font-semibold text-[32px]">Log in</h2>
            </div>
            <div>
              <SSInput
                label="Email"
                type="text"
                name="email"
                placeholder="Enter your email here"
                StartIcon={
                  <Image
                    alt="logo"
                    src={EmailStartEndornment}
                    className="w-[50px] h-[40px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
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
                placeholder="Enter your password here"
                StartIcon={
                  <Image
                    alt="logo"
                    src={PasswordStartEndornment}
                    className="w-[50px] h-[40px] lg:w-[68px] lg:h-[47px] rounded-[10px]"
                  />
                }
                error={!!errors?.password || false}
                errorMessage={errors?.password}
              />
              <div className="flex w-full justify-between items-center">
                <div className="mt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-gray-900">Remember Me</span>
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
                <div
                  className="font-normal text-base leading-[26px] text-[#00A652] text-end cursor-pointer mt-3"
                  onClick={() => router.push("/auth/forgot-password")}
                >
                  Forgot Password?
                </div>
              </div>
            </div>
            <div className="mx-auto w-full mt-10">
              <SSButton
                type="submit"
                isLoading={loading}
                className="w-[154px] relative h-[60px] bg-[#00A652] text-white rounded-lg border-[1px solid rgba(0, 0, 0, 0.05)] cursor-pointer mx-auto"
              >
                Login
              </SSButton>
            </div>
            <div className="text-center font-normal text-base text-[#00000080] mt-5">
              or log in with
            </div>
            <div className="flex justify-center items-center gap-10 md:gap-[18px] mt-10">
              <div
                onClick={() => login()}
                className="hidden w-[154px] h-[60px] rounded-[5px] md:flex justify-center items-center border border-[#00000020] font-semibold text-lg cursor-pointer"
              >
                <div>
                  <Image priority alt="logo" src={GoogleLogo} />
                </div>
                <div>Google</div>
              </div>
              <div className="md:hidden block cursor-pointer">
                <Image
                  priority
                  className="w-[100px]"
                  alt="logo"
                  src={GoogleLogo}
                />
              </div>
              <FacebookLogin
                appId="1083826272167616"
                autoLoad={false}
                callback={responseFacebook}
                render={(renderProps) => (
                  <div onClick={renderProps.onClick}>
                    <div className="hidden w-[145px] px-2 h-[60px] rounded-[5px] md:flex justify-center items-center gap-5 border border-[#00000020] font-semibold text-lg cursor-pointer">
                      <div>
                        <Image
                          className="w-[100px]"
                          alt="logo"
                          src={FacebookLogo}
                        />
                      </div>
                      <div>Facebook</div>
                    </div>
                    <div
                      onClick={renderProps.onClick}
                      className="block -mt-3 cursor-pointer md:hidden"
                    >
                      <Image priority alt="logo" src={FacebookLogo} />
                    </div>
                  </div>
                )}
              />
              <AppleLogin
                clientId="com.crowdbotics.storeandsharevault"
                redirectURI={`${
                  typeof window !== "undefined" && window.location.origin
                }/`}
                callback={handleAppleLogin}
                render={(renderProps) => (
                  <div onClick={renderProps.onClick}>
                    <div className="w-[154px] h-[60px] rounded-[5px] hidden md:flex justify-center items-center border border-[#00000020] font-semibold text-lg cursor-pointer">
                      <div>
                        <Image priority alt="logo" src={AppleLogo} />
                      </div>
                      <div>Apple</div>
                    </div>
                    <div
                      onClick={renderProps.onClick}
                      className="block cursor-pointer md:hidden"
                    >
                      <Image
                        priority
                        className="w-[100px]"
                        alt="logo"
                        src={AppleLogo}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="mt-10 text-center">
              Dont have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-sm font-semibold text-[#00000080]"
              >
                Sign Up
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
