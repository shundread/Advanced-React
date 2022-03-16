import styled from "styled-components";
import nProgress from "nprogress";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { SickButton } from "./styles/SickButton";
import { useCallback, useState } from "react";

const CheckoutFormStyles = styled.form`
  box-shadow = 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const PaymentError = styled.p`
  font-size: 12;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = useCallback(async (e) => {
    // 1. Stop the form from submitting and turn the loader on
    e.preventDefault();
    console.log("We gotta deal with the payment now!");

    // 2. Start the page transition
    setLoading(true);
    nProgress.start();

    // 3. Create the payment method via stripe (Token caomes back here if successful)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    console.error("Error is", error);
    console.log("Payment method", paymentMethod);

    // 4. Handle any errors from stripe
    if (error) {
      setError(error);
    }

    // 5. Send the token from step 3 to our keystone server, via a custom mutation!
    // 6. Change the page to view the order
    // 7. Close the cart
    // 8. Turn the loader off
    setLoading(false);
    nProgress.done();
  }, []);

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      {error && <PaymentError>{error.message}</PaymentError>}
      <CardElement />
      <SickButton>Checkout Now</SickButton>
    </CheckoutFormStyles>
  );
}
