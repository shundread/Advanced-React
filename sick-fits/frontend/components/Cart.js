import { calculateCartTotalPrice } from "../lib/calculateCartTotalPrice";
import { useCart } from "../lib/cartState";
import { formatMoney } from "../lib/formatMoney";
import { useUser } from "../lib/useUser";
import { CartItem } from "./CartItem";
import { CartStyles } from "./styles/CartStyles";
import { CloseButton } from "./styles/CloseButton";
import { Supreme } from "./styles/Supreme";

export function Cart() {
  const { cartOpen, closeCart } = useCart();
  const user = useUser();
  if (!user) return null;
  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{user.name}</Supreme>
        <CloseButton type="button" onClick={closeCart}>
          Close
        </CloseButton>
      </header>
      <ul>
        {user.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calculateCartTotalPrice(user.cart))}</p>
      </footer>
    </CartStyles>
  );
}
