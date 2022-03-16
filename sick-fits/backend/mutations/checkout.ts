import { KeystoneContext } from "@keystone-next/types";
import {
  CartItemCreateInput,
  OrderCreateInput,
} from "../.keystone/schema-types";
import formatMoney from "../lib/formatMoney";
import { StripeConfig } from "../lib/stripe";
import { Session } from "../types";

const graphql = String.raw;

interface Arguments {
  token: string;
}

export async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure the user is signed in
  const session: Session = context.session;
  const userId = session?.itemId;
  if (!userId) {
    throw new Error("You must be logged to do this");
  }

  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          id
          name
          price
          description {
            photo {
              id
              src
            }
          }
        }
      }
    `,
  });

  console.dir(user, { depth: null });

  // 2. Calculate the total price for the order
  const amount = calculateCartTotalPrice(user.cart);
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  console.log(`Amount is ${formatMoney(amount)}`);

  // 3. Create the charge with the stripe library
  const charge = await StripeConfig.paymentIntents
    .create({
      amount,
      currency: "USD",
      confirm: true,
      payment_method: token,
    })
    .catch((error) => {
      console.error("The error is", error);
      throw new Error(error.message);
    });

  // 4. Convert the CartItems to OrderItems
  // 5. Create the order and return it
}

function calculateCartTotalPrice(cartItems) {
  return cartItems.reduce((tally: number, cartItem: CartItemCreateInput) => {
    // The product could have been deleted while still being in the cart
    if (!cartItem.product) return tally;
    return tally + cartItem.product.price * cartItem.quantity;
  }, 0);
}
