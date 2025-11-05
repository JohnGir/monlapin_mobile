// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Exemple de produits
const products = [
  {
    id: '1',
    name: 'Lapin Néo-Zélandais',
    price: 16000,
    image: 'https://example.com/neo-zeland.jpg',
  },
  {
    id: '2',
    name: 'Lapin Californien',
    price: 14000,
    image: 'https://example.com/californien.jpg',
  },
  {
    id: '3',
    name: 'Lapin Bélier',
    price: 25000,
    image: 'https://example.com/belier.jpg',
  },
];

const HomeScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price} FCFA</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur MonLapinCI 🐇</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;
