import gql from "graphql-tag";
import styled from "styled-components";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

export function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    // We will do fancy stuff so we'll manually evict from cache and skip this:
    // refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  const handleClick = useCallback(() => {
    removeFromCart();
  }, []);

  return (
    <BigButton
      disabled={loading}
      type="button"
      title="Remove This Item from Cart"
      onClick={handleClick}
    >
      &times;
    </BigButton>
  );
}
