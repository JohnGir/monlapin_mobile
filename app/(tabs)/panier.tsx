/* import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Article = {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
  image: any;
};

export default function PanierScreen() {
  const [articles, setArticles] = useState<Article[]>([
    { id: "1", nom: "Lapin Blanc", prix: 5000, quantite: 1, image: require("../../assets/live.jpeg") },
    { id: "2", nom: "Lapin Marron", prix: 6000, quantite: 1, image: require("../../assets/live.jpeg") },
  ]);

  const increment = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, quantite: a.quantite + 1 } : a))
    );
  };

  const decrement = (id: string) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id && a.quantite > 1 ? { ...a, quantite: a.quantite - 1 } : a
      )
    );
  };

  const total = articles.reduce((sum, a) => sum + a.prix * a.quantite, 0);

  const payerAvecWave = () => {
    Linking.openURL("https://pay.wave.com/m/M_ci_tV5-aaKPMXQ9/c/ci/");
  };

  const renderItem = ({ item }: { item: Article }) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.nom}>{item.nom}</Text>
        <Text style={styles.prix}>{item.prix} FCFA</Text>
      </View>
      <View style={styles.quantiteContainer}>
        <TouchableOpacity onPress={() => decrement(item.id)}>
          <Ionicons name="remove-circle-outline" size={24} color="#007bff" />
        </TouchableOpacity>
        <Text style={styles.quantite}>{item.quantite}</Text>
        <TouchableOpacity onPress={() => increment(item.id)}>
          <Ionicons name="add-circle-outline" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>🛒 Mon Panier</Text>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.total}>Total : {total} FCFA</Text>

      <TouchableOpacity style={styles.bouton} onPress={payerAvecWave}>
        <Text style={styles.boutonTexte}>Payer avec Wave</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 15 },
  titre: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 15,  marginTop: 20, },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 10, marginBottom: 10, borderRadius: 10, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 10 },
  nom: { fontSize: 16, fontWeight: "600" },
  prix: { fontSize: 14, fontWeight: "bold", color: "#007bff" },
  quantiteContainer: { flexDirection: "row", alignItems: "center" },
  quantite: { marginHorizontal: 10, fontSize: 16 },
  total: { fontSize: 18, fontWeight: "bold", marginVertical: 15, textAlign: "center" },
  bouton: { backgroundColor: "#007bff", padding: 12, borderRadius: 8 },
  boutonTexte: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
 */

import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useCartStore } from "../../src/store/cart";

export default function CartScreen() {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice } = useCartStore();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {items.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 50, fontSize: 18 }}>
          Votre panier est vide
        </Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
                  <Text>Prix: {item.price} FCFA</Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={{ marginRight: 10 }}>
                      <Text style={{ fontSize: 18 }}>➖</Text>
                    </TouchableOpacity>
                    <Text>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={{ marginLeft: 10 }}>
                      <Text style={{ fontSize: 18 }}>➕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={{ color: "red", fontWeight: "bold" }}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Total: {totalPrice()} FCFA
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#00A86B",
                padding: 14,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 15,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>Valider la commande</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
