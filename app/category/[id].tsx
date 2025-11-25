import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../../src/store/auth";
import { useCartStore } from "../../src/store/cart";

type Lapin = {
  _id: string;
  breed: string;
  age: number;
  weight: number;
  price: number;
  description: string;
  stock: number;
  images: string[];
  eleveurId?: {
    farmName: string;
    farmAddress: {
      city: string;
      coordinates?: string;
    };
  };
  categoryId?: {
    _id: string;
    name: string;
    description: string;
    image: string;
  };
};

type CategoryData = {
  category: {
    _id: string;
    name: string;
    description: string;
    image: string;
  };
  lapins: Lapin[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export default function CategoryDetails() {
  const { id } = useLocalSearchParams();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCartStore();
  const token = useAuthStore((state) => state.token);

  // Sécuriser ID
  const categoryId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    console.log("🔄 useEffect déclenché");
    console.log("➡️ ID brut reçu :", id);
    console.log("🔧 ID utilisé après sécurisation :", categoryId);
    console.log("🔐 Token reçu :", token);

    if (!categoryId) {
      console.log("⛔ Aucun ID → stop");
      setError("Aucune catégorie spécifiée");
      setLoading(false);
      return;
    }

    if (!token) {
      console.log("⛔ Aucun token → stop");
      setError("Vous n'êtes pas connecté");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        console.log(`📡 Appel API pour catégorie: ${categoryId}`);
        
        const response = await fetch(`https://api.monlapinci.com/api/lapins/category/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📥 Données reçues:", data);

        if (data.success) {
          setCategoryData(data.data);
          console.log(`✅ ${data.data.lapins.length} lapins chargés`);
        } else {
          setError(data.message || "Erreur lors du chargement");
        }

      } catch (err) {
        console.log("❌ Erreur fetch:", err);
        setError("Erreur de connexion au serveur");
      } finally {
        console.log("⏳ Fin du chargement");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token, categoryId]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/200x200?text=Image+Non+Disponible";
    if (imagePath.startsWith("https")) return imagePath;
    return `https://api.monlapinci.com${imagePath}`;
  };

  // Fonction pour obtenir la première image d'un lapin
  const getLapinImage = (lapin: Lapin) => {
    if (lapin.images && lapin.images.length > 0) {
      return lapin.images[0];
    }
    return "/images/lapins/default.jpg";
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      {/* En-tête de la catégorie */}
      {categoryData?.category && (
        <View style={{ marginBottom: 20, alignItems: "center" }}>
          {categoryData.category.image && (
            <Image
              source={{ uri: getImageUrl(categoryData.category.image) }}
              style={{ 
                width: "100%", 
                height: 150, 
                borderRadius: 10, 
                marginBottom: 15 
              }}
            />
          )}
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5, textAlign: "center" }}>
            {categoryData.category.name}
          </Text>
          <Text style={{ color: "#666", textAlign: "center" }}>
            {categoryData.category.description}
          </Text>
        </View>
      )}

      {loading ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <ActivityIndicator size="large" color="#00A86B" />
          <Text style={{ marginTop: 10, color: "#666" }}>Chargement des lapins...</Text>
        </View>
      ) : error ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              setError(null);
              // Recharger les données
              const fetchData = async () => {
                try {
                  const response = await fetch(`https://api.monlapinci.com/api/lapins/category/${categoryId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  const data = await response.json();
                  if (data.success) setCategoryData(data.data);
                } catch (err) {
                  setError("Erreur de chargement");
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }}
            style={{
              marginTop: 10,
              backgroundColor: "#00A86B",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : !categoryData?.lapins || categoryData.lapins.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: "#777", fontSize: 16, textAlign: "center" }}>
            Aucun lapin disponible dans cette catégorie
          </Text>
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 15 }}>
            Lapins disponibles ({categoryData.lapins.length})
          </Text>
          
          {categoryData.lapins.map((lapin) => (
            <View 
              key={lapin._id} 
              style={{ 
                marginBottom: 20, 
                backgroundColor: "#f9f9f9", 
                borderRadius: 15, 
                padding: 15,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <Image
                source={{ uri: getImageUrl(getLapinImage(lapin)) }}
                style={{ 
                  width: "100%", 
                  height: 200, 
                  borderRadius: 10,
                  backgroundColor: "#f0f0f0"
                }}
                onError={() => console.log("Erreur chargement image pour:", lapin.breed)}
              />
              
              <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 10 }}>
                {lapin.breed}
              </Text>
              
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                <Text style={{ color: "#666" }}>
                  Âge: {lapin.age} semaines
                </Text>
                <Text style={{ color: "#666" }}>
                  Poids: {lapin.weight} kg
                </Text>
              </View>

              {lapin.eleveurId && (
                <Text style={{ color: "#666", marginTop: 2, fontSize: 14 }}>
                  Élevage: {lapin.eleveurId.farmName} - {lapin.eleveurId.farmAddress.city}
                </Text>
              )}
              
              <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 8, color: "#00A86B" }}>
                {lapin.price.toLocaleString()} FCFA
              </Text>

              <Text style={{ color: "#666", marginTop: 5, fontSize: 14 }}>
                Stock: {lapin.stock} disponible(s)
              </Text>

              {lapin.description && (
                <Text style={{ color: "#666", marginTop: 8, fontSize: 14, lineHeight: 18 }}>
                  {lapin.description}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => {
                  console.log("🛒 Ajout au panier :", lapin);
                  addToCart({
                    id: lapin._id,
                    name: lapin.breed,
                    image: getLapinImage(lapin),
                    price: lapin.price,
                    quantity: 1,
                  });
                }}
                style={{
                  marginTop: 15,
                  backgroundColor: "#00A86B",
                  padding: 12,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
                  Ajouter au panier
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}