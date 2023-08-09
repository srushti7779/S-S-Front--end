import { CardElement, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import SSButton from "../form/SSButton";
import { toast } from "react-hot-toast";
import StripeCheckout from "react-stripe-checkout";

export default function CheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const { errors, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (errors) {
      console.error(errors);
      setLoading(false);
      return;
    }

    setIsProcessing(true);
    const plan = PLANS_PRODUCTS.find((data) => data.amount === amount);
    dispatch(
      postPaymentIntent({
        priceId: plan.planId,
        paymentMethod: paymentMethod.id,
      })
    )
      .unwrap()
      .then((res) => {
        if (res) {
          console.log(res);
          toast.success("Subscription created successfully");
        } else {
          toast.error("Failed to create subscription");
        }
      });

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement />
      <SSButton
        className="mt-5 mx-auto w-[200px]"
        disabled={isProcessing || !stripe || !elements}
        id="submit"
      >
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </SSButton>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
