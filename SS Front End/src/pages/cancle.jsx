import SSButton from "@/components/form/SSButton";
import { useRouter } from "next/router";
import React from "react";
import { MdCancel } from "react-icons/md";

const PaymentFailed = () => {
  const router = useRouter();
  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5">
        <MdCancel className="text-[#F7941D]" size={200} />
        <h1 className="font-bold text-[36px]">FAILED!</h1>
        <h1 className="font-bold text-[24px]">
          Your payment was unsuccessfull
        </h1>
        <SSButton
          className="w-[250px] !bg-[#F7941D]"
          onClick={() => router.push("/home")}
        >
          HomePage
        </SSButton>
      </div>
    </div>
  );
};

export default PaymentFailed;
