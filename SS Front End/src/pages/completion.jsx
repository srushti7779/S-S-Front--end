import SSButton from "@/components/form/SSButton";
import { verifySessionId } from "@/redux/slices/paymentSlice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

const PaymentCompleted = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session_id) {
      dispatch(verifySessionId({ session_id }));
    }
  }, [dispatch, router.query]);
  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5">
        <AiFillCheckCircle className="text-[#00A654]" size={200} />
        <h1 className="font-bold text-[36px]">SUCCESS!</h1>
        <h1 className="font-bold text-[24px]">Your payment is successfull</h1>
        <SSButton
          isLoading={loading}
          className="w-[250px]"
          onClick={() => {
            router.push("/home/profile");
            setLoading(true);
          }}
        >
          HomePage
        </SSButton>
      </div>
    </div>
  );
};

export default PaymentCompleted;
