export function calculateCartTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    // The product could have been deleted while still being in the cart
    if (!cartItem.product) return tally;
    return tally + cartItem.product.price * cartItem.quantity;
  }, 0);
}
