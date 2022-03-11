import Link from "next/link";
import { useCart } from "../lib/cartState";
import { useUser } from "../lib/useUser";
import { CartCount } from "./CartCount";
import { SignOut } from "./SignOut";
import { NavStyles } from "./styles/NavStyles";

export default function Nav() {
  const user = useUser();
  const { openCart } = useCart();
  return (
    <NavStyles>
      <Link href="/products">Products</Link>
      {user ? (
        <>
          <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          <SignOut />
          <button type="button" onClick={openCart}>
            My cart
            <CartCount count={cartItemCount(user.cart)} />
          </button>
        </>
      ) : (
        <Link href="/signin">Sign In</Link>
      )}
    </NavStyles>
  );
}

function cartItemCount(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}
