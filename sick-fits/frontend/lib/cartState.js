import { createContext, useCallback, useContext, useState } from "react";

const LocalStateContext = createContext();

export function CartStateProvider({ children }) {
  // This is our own custom provider we will store data (state) and functionality (updaters)
  // in here and anyone can access it via the consumer
  const [cartOpen, setCartOpen] = useState(false);
  const toggleCart = useCallback(() => setCartOpen((open) => !open), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <LocalStateContext.Provider
      value={{ cartOpen, setCartOpen, toggleCart, openCart, closeCart }}
    >
      {children}
    </LocalStateContext.Provider>
  );
}

// Make a custom hook for accessing the cart local state
export function useCart() {
  const all = useContext(LocalStateContext);
  return all;
}
