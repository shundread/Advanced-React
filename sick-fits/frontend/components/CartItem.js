import styled from "styled-components";
import { formatMoney } from "../lib/formatMoney";

const CartItemStyles = styled.li`
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;
  padding: 1rem 0;
  img {
    margin-right: 1rem;
  }
  h3,
  p {
    margin: 0;
  }
`;

export function CartItem({ cartItem }) {
  const { product } = cartItem;
  if (!product) {
    console.error("Unable to find product from cartItem", cartItem);
    return null;
  }
  return (
    <CartItemStyles>
      <img
        width={100}
        src={product.photo?.src}
        alt={product.photo?.alt || product.name}
      />
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * cartItem.quantity)}
          {" - "}
          <em>
            {cartItem.quantity} &times; {formatMoney(product.price)} each
          </em>
        </p>
      </div>
    </CartItemStyles>
  );
}
