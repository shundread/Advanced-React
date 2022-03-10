import { calculateCartTotalPrice } from "../lib/calculateCartTotalPrice";
import { formatMoney } from "../lib/formatMoney";
import { useUser } from "../lib/useUser";
import { CartItem } from "./CartItem";
import { CartStyles } from "./styles/CartStyles";
import { Supreme } from "./styles/Supreme";

export function Cart() {
  const user = useUser();
  if (!user) return null;
  return (
    <CartStyles open>
      <header>
        <Supreme>{user.name}</Supreme>
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
