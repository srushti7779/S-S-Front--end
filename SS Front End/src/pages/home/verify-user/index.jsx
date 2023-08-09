import { getVerification } from "@/redux/slices/verificationSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const VerifyUserWithSMTP = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVerification());
  }, []);
  return (
    <div className="w-full flex justify-center items-start min-h-[85vh]">
      <div className="px-10 max-w-7xl flex flex-col justify-center items-start gap-7 w-full bg-transparent rounded-[20px] mx-auto my-10 relative">
        Verify User
      </div>
    </div>
  );
};

export default VerifyUserWithSMTP;
