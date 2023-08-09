import React, { useEffect, useState } from "react";
import TWOFAImage from "../../assests/images/2fa.png";
import Image from "next/image";
import SSButton from "@/components/form/SSButton";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { authResendOtp, authVerifyOtp } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";

const VerifyOTP = () => {
  const [otp, setOTP] = useState();
  const [userId, setUserId] = useState();
  const router = useRouter();
  const dispatch = useDispatch();
  const { otpLoading } = useSelector((state) => ({
    otpLoading: state.userAuth.otpLoading,
  }));

  useEffect(() => {
    const isUserId = localStorage.getItem("user_id");
    if (!isUserId) {
      router.push("/");
    }
    setUserId(isUserId);
  }, []);

  const handleOtp = () => {
    dispatch(authVerifyOtp({ id: userId, otp }));
  };

  const handleResendOtp = () => {
    dispatch(authResendOtp(userId));
  };
  return (
    <div className="max-w-[1000px] rounded-[20px] bg-white mx-auto my-0 md:my-[50px] h-full flex justify-center items-center w-full p-[70px]">
      <div className="flex flex-col justify-center items-center space-y-10">
        <h2 className="font-semibold text-2xl text-center">
          Two-Factor Authentication
        </h2>
        <Image priority src={TWOFAImage} width={325} />
        <p className="font-normal text-base leading-[26px] max-w-[500px] w-full text-[#00000080] text-center">
          We&apos;ve sent a 6 digit PIN to your phone number. Please put the PIN
          below to continue
        </p>
        <OTPInput
          inputStyle={{
            fontSize: "2rem",
            border: "1px solid #292d3233",
            borderRadius: "10px",
            width: "50px",
            height: "50px",
            margin: "5px",
            "@media (min-width: 758px)": {
              fontSize: "1.5rem",
              margin: "24px",
              width: "77px",
              height: "77px",
            },
          }}
          renderInput={(props) => <input {...props} />}
          value={otp}
          onChange={(value) => setOTP(value)}
          numInputs={6}
        />
        <SSButton
          type="submit"
          className="w-[264px] bg-[#00A652] mt-10 mx-auto h-[60px] rounded-[5px] text-white border-[0.5px] border-[#00000080] font-semibold text-lg cursor-pointer"
          isLoading={otpLoading}
          onClick={handleOtp}
        >
          Submit
        </SSButton>
        <p
          onClick={handleResendOtp}
          className="text-[#292D32] font-semibold cursor-pointer text-center text-base leading-[26px]"
        >
          Resend Code?
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
