import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // ➕ Ajouter un produit au panier
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

      // ❌ Supprimer un article
      removeFromCart: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },

      // 🗑️ Vider le panier
      clearCart: () => set({ items: [] }),

      // ➕ Augmenter quantité
      increaseQuantity: (id) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        });
      },

      // ➖ Diminuer quantité
      decreaseQuantity: (id) => {
        const existing = get().items.find((i) => i.id === id);

        if (existing && existing.quantity > 1) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        } else {
          set({
            items: get().items.filter((i) => i.id !== id),
          });
        }
      },

      // 🔢 Nombre total d’articles
      totalItems: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),

      // 💰 Prix total
      totalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
