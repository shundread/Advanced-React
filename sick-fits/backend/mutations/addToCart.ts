import { KeystoneContext } from "@keystone-next/types";
import { CartItemCreateInput } from "../.keystone/schema-types";
import { Session } from "../types";

export async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1) Query the current user and see if they are logged in
  // 2) Query the current user's cart
  // 3) See if the current item is in their cart
  // 3.A) If so, increment by one
  // 3.B) If not, create a new item
  const session: Session = context.session;
  if (!session.itemId) {
    throw new Error("You must be logged to do this");
  }

  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    // We need to specify which fields we may be interested in here otherwise we only get ID
    resolveFields: "id,quantity",
  });

  const [existingCartItem] = allCartItems;

  console.log("Existing cart item:", existingCartItem);
  if (existingCartItem) {
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  return await context.lists.CartItem.createOne({
    data: {
      quantity: 1,
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
  });
}
