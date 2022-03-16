import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { SickButton } from "./styles/SickButton";
import { useCallback } from "react";

const CheckoutFormStyles = styled.form`
  box-shadow = 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export function Checkout() {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("We gotta deal with the payment now!");
  }, []);

  return (
    <Elements stripe={stripeLib}>
      <CheckoutFormStyles onSubmit={handleSubmit}>
        <CardElement />
        <SickButton>Check Out Now</SickButton>
      </CheckoutFormStyles>
    </Elements>
  );
}
