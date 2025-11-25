const API_URL = "https://api.monlapinci.com/api";

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Erreur de connexion");

  const data = await response.json();
  console.log("login response:", data);
  return data; // {success, token, user}
}
