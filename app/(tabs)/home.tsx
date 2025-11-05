import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ads = [
  { id: "1", image: require("../../assets/ad1.jpeg") },
  { id: "2", image: require("../../assets/ad2.jpeg") },
  { id: "3", image: require("../../assets/ad3.jpg") },
];

const categories = [
  { id: "1", name: "Lapins frais", image: require("../../assets/fresh.jpeg") },
  { id: "2", name: "Lapins braisés", image: require("../../assets/braise.jpeg") },
  { id: "3", name: "Lapins précuits", image: require("../../assets/braise.jpeg") },
  { id: "4", name: "Lapins vivants", image: require("../../assets/live.jpeg") },
];

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* === Logo === */}
      <View style={{ alignItems: "center", paddingTop: 40, paddingBottom: 10 }}>
        <Image
          source={require("../../assets/logo.jpg")}
          style={{ width: 120, height: 60, resizeMode: "contain" }}
        />
      </View>

      {/* === Barre de recherche + cloche === */}
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

      {/* === Carrousel === */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={{ marginBottom: 20 }}
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

      {/* === Catégories === */}
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
          Catégories de lapins
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
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
                source={item.image}
                style={{ width: "100%", height: 120 }}
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
