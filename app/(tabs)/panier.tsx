
import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../src/store/cart";
import { useTheme } from "../../src/theme/ThemeProvider";
import { globalStyles } from "../../src/theme/globalStyles";

export default function CartScreen() {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice } = useCartStore();
  const { colors } = useTheme(); // ⬅️ UTILISATION DU THÈME

  const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR') + ' FCFA';
  };

  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath) {
      return "https://via.placeholder.com/60x60?text=No+Image";
    }
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `https://api.monlapinci.com${imagePath}`;
  };

  return (
    <View style={globalStyles.container}>
      {/* En-tête du panier */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border.light }}>
        <Text style={[globalStyles.title, { color: colors.text.primary }]}>
          Mon Panier
        </Text>
        <Text style={[globalStyles.caption, { color: colors.text.secondary, marginTop: 4 }]}>
          {items.length} article(s)
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
          <Ionicons name="cart-outline" size={64} color={colors.gray[400]} />
          <Text style={[globalStyles.subtitle, {
            textAlign: "center",
            marginTop: 20,
            marginBottom: 10,
            color: colors.text.primary
          }]}>
            Votre panier est vide
          </Text>
          <Text style={[globalStyles.caption, {
            textAlign: "center",
            color: colors.text.secondary
          }]}>
            Ajoutez des produits depuis les catégories pour les voir apparaître ici
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={[globalStyles.card, {
                flexDirection: "row",
                marginBottom: 16,
                alignItems: "center",
              }]}>
                {/* Image du produit */}
                <Image
                  source={{ uri: getImageUrl(item.image) }}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    backgroundColor: colors.gray[200]
                  }}
                />

                {/* Informations du produit */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[globalStyles.body, {
                    fontWeight: "600",
                    color: colors.text.primary,
                    marginBottom: 4
                  }]}>
                    {item.name}
                  </Text>
                  <Text style={[globalStyles.caption, {
                    color: colors.text.secondary,
                    marginBottom: 8
                  }]}>
                    {formatPrice(item.price)}
                  </Text>

                  {/* Contrôle de quantité */}
                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(item.id)}
                        style={{
                          backgroundColor: colors.gray[100],
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="remove" size={16} color={colors.text.primary} />
                      </TouchableOpacity>

                      <Text style={[globalStyles.body, {
                        marginHorizontal: 16,
                        color: colors.text.primary,
                        fontWeight: "600",
                        minWidth: 20,
                        textAlign: "center"
                      }]}>
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() => increaseQuantity(item.id)}
                        style={{
                          backgroundColor: colors.gray[100],
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="add" size={16} color={colors.text.primary} />
                      </TouchableOpacity>
                    </View>

                    {/* Prix total pour cet article */}
                    <Text style={[globalStyles.body, {
                      fontWeight: "600",
                      color: colors.primary
                    }]}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </View>
                </View>

                {/* Bouton supprimer */}
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={{
                    padding: 8,
                    marginLeft: 8,
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Résumé et validation */}
          <View style={{
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border.light,
            backgroundColor: colors.background.tertiary
          }}>
            {/* Sous-total */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8
            }}>
              <Text style={[globalStyles.body, { color: colors.text.secondary }]}>
                Sous-total
              </Text>
              <Text style={[globalStyles.body, { color: colors.text.primary }]}>
                {formatPrice(totalPrice())}
              </Text>
            </View>

            {/* Livraison */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8
            }}>
              <Text style={[globalStyles.body, { color: colors.text.secondary }]}>
                Livraison
              </Text>
              <Text style={[globalStyles.body, { color: colors.success }]}>
                à determiner
              </Text>
            </View>

            {/* Séparateur */}
            <View style={{
              height: 1,
              backgroundColor: colors.border.light,
              marginVertical: 12
            }} />

            {/* Total */}
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20
            }}>
              <Text style={[globalStyles.subtitle, { color: colors.text.primary }]}>
                Total
              </Text>
              <Text style={[globalStyles.subtitle, { color: colors.primary }]}>
                {formatPrice(totalPrice())}
              </Text>
            </View>

            {/* Bouton de validation */}
            <TouchableOpacity
              style={globalStyles.buttonPrimary}
              onPress={() => {
                // TODO: Implémenter la logique de commande
                console.log("Validation de la commande");
              }}
            >
              <Text style={globalStyles.buttonPrimaryText}>
                Valider la commande
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                globalStyles.caption,
                {
                  textAlign: "center",
                  marginTop: 12,
                  color: colors.text.secondary,
                },
              ]}
            >
              Livraison disponible dans le Grand Abidjan.
              Les commandes passées après 18h peuvent être livrées le lendemain.
            </Text>

          </View>
        </>
      )}
    </View>
  );
}
