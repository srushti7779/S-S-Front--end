import React, { useEffect, useState } from "react";
import SSModal from "../form/SSModal";
import classNames from "classnames";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Form, Formik } from "formik";
import SSInput from "../form/SSInput";
import SSButton from "../form/SSButton";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import {
  postPaymentIntent,
  postPlansActivity,
} from "@/redux/slices/paymentSlice";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PLANS_PRODUCTS } from "@/utils/helper";

const SSSubcriptionModal = ({ subscriptionModal, setSubscriptionModal }) => {
  const dispatch = useDispatch();
  const elements = useElements();
  const stripe = useStripe();
  const { planList, loading, planData } = useSelector((state) => ({
    planList: state.paymentSlice.planList,
    loading: state.paymentSlice.loading,
    planData: state.paymentSlice.planData,
  }));
  const [isMonthly, setIsMonthly] = useState(true);
  const [stripePromise, setStripePromise] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [amount, setAmount] = useState();

  useEffect(() => {
    if (stripe && elements) {
      const result = stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (result.error) {
        console.log(result.error.message);
      } else {
        const paymentMethod1 = result.paymentMethod;
        setPaymentMethod(paymentMethod1);
      }
    }
  }, []);

  useEffect(() => {
    const plan = PLANS_PRODUCTS.find((data) => data.amount === amount);
    if (amount) {
      dispatch(postPaymentIntent({ priceId: plan.id }))
        .unwrap()
        .then((res) => {
          setAmount(null);
          const data = {};
          data.title = plan.title;
          data.storage = plan.storage;
          data.buddies = plan.buddies;
          if (isMonthly) {
            data.priceMonthly = true;
          } else {
            data.priceYearly = true;
          }
          // if (planData) {
          //   dispatch(putPlansActivity(data));
          // } else {
          dispatch(postPlansActivity(data))
            .unwrap()
            .then(() => {
              // }
              localStorage.setItem("plan", "intialised");
              setSubscriptionModal(false);
              window.location.href = res.subscription.url;
            })
            .catch((e) => {});
        });
    }
  }, [amount]);

  return (
    <div>
      <SSModal
        isOpen={subscriptionModal}
        onClose={() => {}}
        panelLength="max-w-[1200px]"
      >
        <div className="px-4 md:px-8 py-4 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-lg md:text-4xl">
            Subscription & packages
          </h1>
          <div className="flex justify-center items-center my-5">
            <div
              onClick={() => setIsMonthly(true)}
              className={classNames(
                "w-[100px] md:w-[190px] h-[50px] flex justify-center items-center cursor-pointer font-medium text-base md:text-xl rounded-l-[50px]",
                isMonthly
                  ? "bg-[#00A652] text-white"
                  : "bg-[#00A6520D] text-[#00A652]"
              )}
            >
              Monthly
            </div>
            <div
              onClick={() => setIsMonthly(false)}
              className={classNames(
                "w-[100px] md:w-[190px] h-[50px] flex justify-center items-center font-medium cursor-pointer text-base md:text-xl rounded-r-[50px]",
                isMonthly
                  ? "bg-[#00A6520D] text-[#00A652]"
                  : "bg-[#00A652] text-white"
              )}
            >
              Yearly
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full justify-center items-center gap-10">
            {[1, 2, 3]?.map((plan, index) => (
              <div
                key={index}
                className="rounded-[20px] w-full flex flex-col justify-center items-center px-5 py-4 bg-white shadow-lg ring-offset-0 border ring-opacity-25"
              >
                <div className="w-full rounded-[10px]  flex flex-col justify-center items-center gap-4 py-10 bg-[#F4F7F5]">
                  <div
                    className={classNames(
                      "w-[135px] rounded-[23px] h-[45px] flex justify-center items-center font-bold text-xl text-white",
                      plan === 1
                        ? "bg-[#FBBC05]"
                        : plan === 2
                        ? "bg-[#A7D170]"
                        : "bg-[#F19ECE]"
                    )}
                  >
                    {plan === 1 ? "BASIC" : plan === 2 ? "STANDARD" : "PREMIUM"}
                  </div>
                  <div className="font-bold relative text-[36px] text-black mt-4">
                    {!isMonthly && (
                      <div className="text-[#00000080] absolute -top-4 left-[30%] text-base line-through">
                        $
                        {plan === 1
                          ? "83.88"
                          : plan === 2
                          ? "199.88"
                          : "179.88"}
                      </div>
                    )}
                    $
                    {isMonthly
                      ? plan === 1
                        ? "6.99"
                        : plan === 2
                        ? "9.99"
                        : "14.99"
                      : plan === 1
                      ? "71.88"
                      : plan === 2
                      ? "95.00"
                      : "125.00"}
                  </div>
                  <div className="font-medium text-base text-black">
                    For single membership
                  </div>
                </div>
                <div className="flex flex-col gap-5 justify-center items-start w-full mt-5">
                  {[1, 2, 3, 4].map((data, index) => (
                    <p
                      key={index}
                      className="flex gap-3 justify-center items-center"
                    >
                      <span>
                        <AiOutlineCheckCircle
                          className="text-[#00A652]"
                          size={30}
                        />
                      </span>
                      <span>Feature Name will be here</span>
                    </p>
                  ))}
                </div>
                <Formik initialValues={{ coupon_code: "" }}>
                  <Form>
                    <SSInput
                      placeholder="Coupon Code"
                      name="coupon_code"
                      className="border-b focus:outline-none border-b-[#00000020]"
                      size="w-full h-[35px]"
                    />
                    <SSButton
                      onClick={() => {
                        setPaymentModal(!paymentModal);
                        setAmount(
                          isMonthly
                            ? plan === 1
                              ? "6.99"
                              : plan === 2
                              ? "9.99"
                              : "14.99"
                            : plan === 1
                            ? "71.88"
                            : plan === 2
                            ? "95.00"
                            : "125.00"
                        );
                      }}
                      isLoading={loading}
                      className={classNames("w-[190px] h-[57px] mt-5 mx-auto")}
                      color={
                        plan === 2
                          ? "bg-[#00A652]"
                          : "bg-white border-[1px] border-[#00000050] !text-green-500 disabled:bg-[#00000010]"
                      }
                    >
                      Choose Plan
                    </SSButton>
                  </Form>
                </Formik>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden">
          <CardElement />
        </div>
      </SSModal>
    </div>
  );
};

export default SSSubcriptionModal;
