import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

const CartContext = createContext(null);

const getCartKey = (user) => {
  if (user?.email) {
    return `cart_${user.email}`;
  }
  return "cart_guest";
};

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [cartKey, setCartKey] = useState(getCartKey(user));

  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem(getCartKey(user));
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      return [];
    }
  });

  // when logged-in user changes, switch to that user's cart
  useEffect(() => {
    const newKey = getCartKey(user);
    setCartKey(newKey);

    try {
      const savedCart = localStorage.getItem(newKey);
      setItems(savedCart ? JSON.parse(savedCart) : []);
    } catch (error) {
      console.error("Failed to switch cart for user:", error);
      setItems([]);
    }
  }, [user]);

  // save current cart under current user's key
  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [items, cartKey]);

  const addToCart = (menuItem, quantity = 1) => {
    setItems((prev) => {
      const normalizedItemId = menuItem.itemId || menuItem.item_id;
      const normalizedItemName = menuItem.itemName || menuItem.item_name;
      const normalizedImageUrl = menuItem.imageUrl || menuItem.image_url;
      const normalizedSize = menuItem.selectedSize || "DEFAULT";

      const existing = prev.find(
        (i) =>
          (i.itemId || i.item_id) === normalizedItemId &&
          (i.selectedSize || "DEFAULT") === normalizedSize
      );

      if (existing) {
        return prev.map((i) =>
          (i.itemId || i.item_id) === normalizedItemId &&
          (i.selectedSize || "DEFAULT") === normalizedSize
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          ...menuItem,
          itemId: normalizedItemId,
          itemName: normalizedItemName,
          imageUrl: normalizedImageUrl,
          selectedSize: normalizedSize,
          price: Number(menuItem.price),
          quantity,
        },
      ];
    });
  };

  const updateQty = (itemId, quantity, selectedSize = "DEFAULT") => {
    setItems((prev) =>
      prev
        .map((i) =>
          (i.itemId || i.item_id) === itemId &&
          (i.selectedSize || "DEFAULT") === selectedSize
            ? { ...i, quantity }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (itemId, selectedSize = "DEFAULT") => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(
            (i.itemId || i.item_id) === itemId &&
            (i.selectedSize || "DEFAULT") === selectedSize
          )
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(cartKey);
  };

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}
