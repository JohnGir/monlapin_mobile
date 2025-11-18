
const API_URL = "https://api.monlapinci.com/api";

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error("Erreur API");
  const data = await response.json();
  console.log("fetchCategories response:", data);
  return data;
}

export async function fetchCategoryById(id: string) {
  const response = await fetch(`${API_URL}/categories/${id}`);
  if (!response.ok) throw new Error("Erreur API");
  const data = await response.json();
  console.log(`fetchCategoryById(${id}) response:`, data);
  return data;
}
