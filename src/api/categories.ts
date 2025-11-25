// Pour récupérer TOUTES les catégories
export async function fetchCategories(token: string) {
  console.log("🔎 fetchCategories() → paramètres reçus :", { token });

  try {
    const response = await fetch(`https://api.monlapinci.com/api/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🌐 Status API :", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ API a répondu une erreur :", errorText);
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("📦 Catégories reçues :", data);
    return data;
  } catch (error) {
    console.log("⛔ Erreur fetchCategories :", error);
    throw error;
  }
}

// Pour récupérer une catégorie spécifique par ID
export async function fetchCategoryById(id: string, token: string) {
  console.log("🔎 fetchCategoryById() → paramètres reçus :", { id, token });

  try {
    const response = await fetch(`https://api.monlapinci.com/api/categories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🌐 Status API :", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ API a répondu une erreur :", errorText);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Catégorie reçue :", data);
    return data;
  } catch (error) {
    console.log("⛔ Erreur fetchCategoryById :", error);
    throw error;
  }
}