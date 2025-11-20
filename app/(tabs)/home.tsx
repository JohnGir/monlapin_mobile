import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { fetchCategories } from "../../src/api/categories";

const { width } = Dimensions.get("window");

const ads = [
  { id: "1", image: require("../../assets/ad1.jpeg") },
  { id: "2", image: require("../../assets/ad2.jpeg") },
  { id: "3", image: require("../../assets/ad3.jpg") },
];

type Category = {
  _id: string; // ← Changé de 'id' à '_id'
  name: string;
  image: string;
  description: string;
};

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger catégories API
  useEffect(() => {
    fetchCategories()
      .then((data) => {
        // ⚠️ Les données viennent dans data.data
        if (data.success && data.data) {
          setCategories(data.data);
        } else {
          setError("Aucune catégorie trouvée");
        }
      })
      .catch((err) => {
        console.log("Erreur API:", err);
        setError("Erreur de chargement");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fonction pour construire l'URL complète de l'image
  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `https://api.monlapinci.com${imagePath}`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* LOGO */}
      <View style={{ alignItems: "center", paddingTop: 40, paddingBottom: 10 }}>
        <Image
          source={require("../../assets/logo.jpg")}
          style={{ width: 120, height: 60, resizeMode: "contain" }}
        />
      </View>

      {/* SEARCH */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f1f1f1",
            borderRadius: 10,
            paddingHorizontal: 10,
            flex: 1,
            marginRight: 10,
          }}
        >
          <Ionicons name="search" size={20} color="#777" />
          <TextInput
            placeholder="Rechercher un produit..."
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        <TouchableOpacity style={{ padding: 6 }}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* CARROUSEL */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
        {ads.map((ad) => (
          <Image
            key={ad.id}
            source={ad.image}
            style={{
              width: width - 40,
              height: 160,
              borderRadius: 15,
              marginHorizontal: 20,
            }}
          />
        ))}
      </ScrollView>

      {/* CATEGORIES */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
          Catégories de lapins
        </Text>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={{ textAlign: "center", color: "red", marginTop: 20 }}>
            {error}
          </Text>
        ) : categories.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777", marginTop: 20 }}>
            Aucune catégorie disponible
          </Text>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {categories.map((item) => (
              <Link
                key={item._id} // ← Utilise _id comme clé
                href={{
                  pathname: "/category/[id]", // ← Static route with dynamic segment placeholder,
                  params: { id: item._id, name: item.name  }, // ← Utilise _id pour les paramètres // ← Pass dynamic values here
                }}
                asChild
              >
                <TouchableOpacity
                  style={{
                    width: "48%",
                    backgroundColor: "#f9f9f9",
                    borderRadius: 15,
                    marginBottom: 15,
                    overflow: "hidden",
                    elevation: 2,
                  }}
                >
                  <Image
                    source={{ uri: getImageUrl(item.image) }} // ← URL complète de l'image
                    style={{ 
                      width: "100%", 
                      height: 120,
                      backgroundColor: "#f0f0f0" // Fond de fallback
                    }}
                    onError={(e) => {
                      console.log("Erreur de chargement image:", item.image);
                      // Vous pouvez ajouter une image de fallback ici
                    }}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      paddingVertical: 10,
                      fontWeight: "600",
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}