import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // 1. SAFE LOAD: Try-catch block prevents app crash if localStorage is corrupted
    try {
      const savedCart = localStorage.getItem("festix_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Cart hydration error:", error);
      return [];
    }
  });

  // 2. PERSISTENCE: Keep localStorage in sync with state
  useEffect(() => {
    localStorage.setItem("festix_cart", JSON.stringify(cart));
  }, [cart]);

  /**
   * ✅ SYNC FIX: addToCart
   * Ensures that we check for both eventId AND tierName to prevent duplicates.
   */
  const addToCart = (item) => {
    // Safety check: ensure item has necessary properties
    if (!item.eventId || !item.tierName) {
      console.error("Cart Error: Missing item details", item);
      return;
    }

    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (i) => i.eventId === item.eventId && i.tierName === item.tierName,
      );

      if (existingItemIndex > -1) {
        // Item exists: Update quantity
        const updatedCart = [...prev];
        const existingItem = updatedCart[existingItemIndex];

        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + (item.quantity || 1),
        };

        toast.success(`Increased ${item.tierName} quantity`);
        return updatedCart;
      }

      // New Item: Add to cart
      toast.success(`${item.tierName} added to cart!`);
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (eventId, tierName) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.eventId === eventId && item.tierName === tierName),
      ),
    );
    toast.error("Removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("festix_cart");
  };

  // 3. UTILITY: Calculate totals automatically for the UI
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal, // ✅ Helps Sync UI Prices
        cartCount, // ✅ Helps Sync Navbar Badges
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
