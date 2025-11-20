import { create } from "zustand";

// Typage d'un produit / article dans le panier
export type CartItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addToCart: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      });
    } else {
      set({ items: [...get().items, item] });
    }
  },

  removeFromCart: (id) =>
    set({ items: get().items.filter((i) => i.id !== id) }),

  clearCart: () => set({ items: [] }),

  increaseQuantity: (id) =>
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }),

  decreaseQuantity: (id) =>
    set({
      items: get().items.map((i) =>
        i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      ),
    }),

  totalItems: () =>
    get().items.reduce((acc, i) => acc + i.quantity, 0),

  totalPrice: () =>
    get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
}));
