import React, { useState } from "react";
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
