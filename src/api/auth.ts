// src/api/auth.ts
const API_URL = "https://api.monlapinci.com/api";

// 🔹 Typage de la réponse login
export type LoginResponse = {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errJson?.message || "Erreur de connexion",
      };
    }

    const data = await response.json();
    console.log("login response:", data);

    return {
      success: data.success,
      token: data.token,
      user: data.user,
      message: data.message,
    };
  } catch (err: any) {
    console.log("Erreur réseau login:", err.message);
    return {
      success: false,
      message: "Impossible de contacter le serveur",
    };
  }
}
