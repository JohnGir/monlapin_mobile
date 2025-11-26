import { create } from "zustand";

type AuthState = {
  token: string | null;
  user: any | null; // 👈 ajoute user ici (ou un type plus précis)
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
}));
