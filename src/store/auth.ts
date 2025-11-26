// src/store/auth.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, LoginResponse } from "../../src/api/auth";

type AuthState = {
  token: string | null;
  user: any | null;
  loginLoading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  autoLogin: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loginLoading: false,

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),

  autoLogin: async () => {
    const AUTO_EMAIL = "giralzoro@gmail.com";
    const AUTO_PASSWORD = "123456";

    try {
      set({ loginLoading: true });

      // 🔹 Appel à l'API login
      const res: LoginResponse = await login(AUTO_EMAIL, AUTO_PASSWORD);

      if (res.success && res.token) {
        set({ token: res.token, user: res.user });

        // 🔹 Sauvegarde du token pour persistance
        await AsyncStorage.setItem("@token", res.token);
        if (res.user) {
          await AsyncStorage.setItem("@user", JSON.stringify(res.user));
        }

        console.log("🔑 Auto-login réussi");
      } else {
        console.log("❌ Auto-login échoué:", res.message);
      }
    } catch (err: any) {
      console.log("❌ Erreur auto-login:", err.message);
    } finally {
      set({ loginLoading: false });
    }
  },
}));
