// app/(tabs)/home.tsx
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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { fetchCategories } from "../../src/api/categories";
import { login } from "../../src/api/auth";
import { useAuthStore } from "../../src/store/auth";
import { useTheme } from "../../src/theme/ThemeProvider";
import { globalStyles } from "../../src/theme/globalStyles";

// 🔐 Identifiants en dur TEMPORAIRES
const AUTO_EMAIL = "eleveur.bouafle@test.com";
const AUTO_PASSWORD = "123456";

const { width } = Dimensions.get("window");

const ads = [
  { id: "1", image: require("../../assets/barner.png") },
  { id: "2", image: require("../../assets/ad2.jpeg") },
  { id: "3", image: require("../../assets/ad3.jpg") },
];

type Category = {
  _id: string;
  name: string;
  image: string;
  description: string;
  stockTotal: number;
};

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { token, loginLoading } = useAuthStore();
  const { colors } = useTheme();

  // --- Charger catégories API après login global ---
  useEffect(() => {
    async function loadCategories() {
      if (loginLoading) return; // attendre que autoLogin du layout se termine

      if (!token) {
        setError("Connexion requise");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await fetchCategories(token);

        if (data.success && data.data) {
          setCategories(data.data);
        } else {
          setError("Aucune catégorie disponible");
        }
      } catch (err: any) {
        setError("Erreur de chargement des catégories");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, [token, loginLoading]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/150x120?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://api.monlapinci.com${imagePath}`;
  };

  const handleCategoryPress = (categoryId: string) => {
    console.log("🎯 Navigation vers catégorie:", categoryId);
    router.push(`/category/${categoryId}`);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Recharger les catégories
    if (token) {
      const loadCategories = async () => {
        try {
          const data = await fetchCategories(token);
          if (data.success && data.data) {
            setCategories(data.data);
          }
        } catch (err) {
          setError("Erreur de chargement");
        } finally {
          setLoading(false);
        }
      };
      loadCategories();
    }
  };

  // Afficher le loading principal
  if (loginLoading) {
    return (
      <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[globalStyles.body, { marginTop: 10, color: colors.text.secondary }]}>
          Connexion en cours...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      {/* LOGO */}
      <View style={{ alignItems: "center", paddingTop: 40, paddingBottom: 10 }}>
        <Image
          source={require("../../assets/mlcilogo.png")}
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
            backgroundColor: colors.gray[100],
            borderRadius: 10,
            paddingHorizontal: 10,
            flex: 1,
            marginRight: 10,
          }}
        >
          <Ionicons name="search" size={20} color={colors.gray[500]} />
          <TextInput
            placeholder="Rechercher un produit..."
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              marginLeft: 8,
              paddingVertical: 8,
              color: colors.text.primary,
            }}
            placeholderTextColor={colors.gray[500]}
          />
        </View>

        <TouchableOpacity
          style={{ padding: 6 }}
          onPress={() => Alert.alert("Notifications", "Fonctionnalité à venir!")}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* CARROUSEL */}
      <View style={{ marginBottom: 25 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          style={{ marginBottom: 10 }}
        >
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
      </View>

      {/* CATEGORIES */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        {/* TITRE */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Text style={[{ fontSize: 20, fontWeight: "bold", color: colors.text.primary }]}>
            Catégories de lapins
          </Text>

          {categories.length > 0 && (
            <Text style={{ color: colors.text.secondary, fontSize: 14 }}>
              {categories.length} catégorie(s)
            </Text>
          )}
        </View>

        {/* LOADING */}
        {loading ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 10, color: colors.text.secondary }}>
              Chargement des catégories...
            </Text>
          </View>
        ) : error ? (
          // ERREUR
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
            <Text
              style={{
                textAlign: "center",
                color: colors.error,
                marginTop: 10,
                marginBottom: 15,
              }}
            >
              {error}
            </Text>

            <TouchableOpacity
              onPress={handleRetry}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : categories.length === 0 ? (
          // AUCUNE CATÉGORIE
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons name="folder-open-outline" size={48} color={colors.gray[400]} />
            <Text style={{ textAlign: "center", color: colors.gray[500], marginTop: 10 }}>
              Aucune catégorie disponible
            </Text>
          </View>
        ) : (
          // LISTE DES CATÉGORIES
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {categories.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={() => handleCategoryPress(item._id)}
                style={{
                  width: "48%",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 15,
                  marginBottom: 15,
                  overflow: "hidden",
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <Image
                  source={{ uri: getImageUrl(item.image) }}
                  style={{
                    width: "100%",
                    height: 120,
                    backgroundColor: "#f0f0f0",
                  }}
                  onError={() =>
                    console.log("Erreur image catégorie:", item.name)
                  }
                />

                <View style={{ padding: 12 }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: 14,
                      marginBottom: 4,
                      color: colors.text.primary,
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      color: colors.text.secondary,
                      marginBottom: 6,
                    }}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>

                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      color: colors.accent,
                      fontWeight: "500",
                    }}
                  >
                    {item.stockTotal || 0} disponible(s)
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>



      {/* BOUTON POUR TESTER */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <TouchableOpacity
          onPress={() => {
            console.log("🔍 Token actuel:", token);
            console.log("📊 Catégories chargées:", categories.length);
            Alert.alert(
              "Info Débug",
              `Token: ${token ? "✓ Présent" : "✗ Absent"}\nCatégories: ${categories.length}`
            );
          }}
          style={{
            backgroundColor: colors.gray[100],
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.gray[600], fontSize: 12 }}>ℹ️ Info Débug</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}