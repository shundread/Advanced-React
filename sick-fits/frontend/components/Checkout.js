import styled from "styled-components";
import nProgress from "nprogress";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import { SickButton } from "./styles/SickButton";
import { ErrorMessage } from "./ErrorMessage";

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

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
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION
  );

  // This wasn't working as a callback somehow, but maybe React was just
  // throwing a confusing error?
  async function handleSubmit(e) {
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
    console.log("Payment method", paymentMethod);

    // 4. Handle any errors from stripe
    if (error) {
      console.error("Error is", error);
      nProgress.done();
      setError(error);
      setLoading(false);
      return;
    }

    // 5. Send the token from step 3 to our keystone server, via a custom mutation!
    const orderResult = await checkout({
      variables: {
        token: paymentMethod.id,
      },
    });

    console.log("Finished with the order");
    console.log(orderResult);

    // 6. Change the page to view the order
    // 7. Close the cart
    // 8. Turn the loader off
    nProgress.done();
    setLoading(false);
  }

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      <ErrorMessage error={error} />
      <ErrorMessage error={graphQLError} />
      <CardElement />
      <SickButton>Checkout Now</SickButton>
    </CheckoutFormStyles>
  );
}
