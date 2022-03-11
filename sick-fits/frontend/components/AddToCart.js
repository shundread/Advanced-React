import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { CURRENT_USER_QUERY } from "../lib/useUser";
import { useCallback } from "react";
import { useCart } from "../lib/cartState";

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

export function AddToCart({ id }) {
  const { openCart } = useCart();
  const [addToCart, { data, error, loading }] = useMutation(
    ADD_TO_CART_MUTATION,
    {
      variables: { id },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  const handleClick = useCallback(() => {
    addToCart();
    openCart();
  }, []);

  console.log(data, error, loading);
  return (
    <button type="button" onClick={handleClick} disabled={loading}>
      Add to cart 🛒️
    </button>
  );
}
