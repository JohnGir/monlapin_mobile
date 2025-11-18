import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchCategoryById } from "../../src/api/categories";
import { useCartStore } from "../../src/store/cart";

// Type Category
type Category = {
  id: string;
  name: string;
  image: string;
  price?: number; // si ton API propose un prix
};

export default function CategoryDetails() {
  const { id } = useLocalSearchParams();

  // convertir id → string
  const categoryId = Array.isArray(id) ? id[0] : id;

  const [category, setCategory] = useState<Category | null>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (categoryId) {
      fetchCategoryById(categoryId)
        .then(setCategory)
        .catch(console.log);
    }
  }, [categoryId]);

  if (!category) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  const handleAddToCart = () => {
    addToCart({
      id: category.id,
      name: category.name,
      image: category.image,
      price: category.price ?? 1000, // fallback
      quantity: 1,
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Image
        source={{ uri: category.image }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 15,
          marginBottom: 20,
        }}
      />

      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        {category.name}
      </Text>

      <TouchableOpacity
        onPress={handleAddToCart}
        style={{
          backgroundColor: "#00A86B",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
          Ajouter au panier
        </Text>
      </TouchableOpacity>
    </View>
  );
}
