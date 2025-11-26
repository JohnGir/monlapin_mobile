import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../src/store/cart";
import { useAuthStore } from "../../src/store/auth";
import { useTheme } from "../../src/theme/ThemeProvider";
import { globalStyles } from "../../src/theme/globalStyles";

// =========================
// 🔵 Fonction API : Valider la commande
// =========================
async function validateOrder(orderData: any, token: string) {
  try {
    const response = await fetch("https://api.monlapinci.com/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la commande");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export default function CartScreen() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
    clearCart,
  } = useCartStore();

  const { user, token } = useAuthStore();
  const { colors } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔹 Formatage des prix
  const formatPrice = (price: number) =>
    price.toLocaleString("fr-FR") + " FCFA";

  // 🔹 Gestion URL images
  const getImageUrl = (imagePath?: string): string => {
    if (!imagePath)
      return "https://via.placeholder.com/60x60?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://api.monlapinci.com${imagePath}`;
  };

  // =========================
  // 🔵 Validation de commande
  // =========================
  const handleValidateOrder = async () => {
    if (items.length === 0) {
      Alert.alert("Panier vide", "Votre panier est vide.");
      return;
    }

    if (!user || !token) {
      Alert.alert(
        "Connexion requise",
        "Veuillez vous connecter pour passer une commande."
      );
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: items.map((item: { id: any; name: any; price: any; quantity: any; image: any; }) => ({
          lapinId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: totalPrice(),
        customerInfo: {
          userId: user.id,
          email: user.email,
          phone: user.phone,
        },
        deliveryAddress: {
          city: "Abidjan",
          address: "À préciser",
        },
      };

      const result = await validateOrder(orderData, token);

      if (result.success) {
        Alert.alert(
          "Commande Validée ! 🎉",
          `Votre commande #${result.data.orderNumber} a été enregistrée.\n\nVous recevrez un email et SMS de confirmation.\n\nTotal: ${formatPrice(
            totalPrice()
          )}`,
          [
            {
              text: "OK",
              onPress: () => {
                clearCart();
              },
            },
          ]
        );
      } else {
        throw new Error(result.message || "Erreur lors de la validation");
      }
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Une erreur est survenue lors de la commande."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // =========================
  // 🔵 Pop-up de confirmation
  // =========================
  const confirmOrder = () => {
    Alert.alert(
      "Confirmer la commande",
      `Êtes-vous sûr de vouloir valider votre commande pour ${formatPrice(
        totalPrice()
      )} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Confirmer", onPress: handleValidateOrder },
      ]
    );
  };

  return (
    <View style={globalStyles.container}>
      {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
      {/* HEADER */}
      {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}
      >
        <Text style={[globalStyles.title, { color: colors.text.primary }]}>
          Mon Panier
        </Text>
        <Text
          style={[
            globalStyles.caption,
            { color: colors.text.secondary, marginTop: 4 },
          ]}
        >
          {items.length} article(s)
        </Text>
      </View>

      {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
      {/* PANIER VIDE */}
      {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Ionicons
            name="cart-outline"
            size={64}
            color={colors.gray[400]}
          />

          <Text
            style={[
              globalStyles.subtitle,
              {
                textAlign: "center",
                marginTop: 20,
                marginBottom: 10,
                color: colors.text.primary,
              },
            ]}
          >
            Votre panier est vide
          </Text>

          <Text
            style={[
              globalStyles.caption,
              { textAlign: "center", color: colors.text.secondary },
            ]}
          >
            Ajoutez des produits depuis les catégories pour les voir
            apparaître ici
          </Text>
        </View>
      ) : (
        <>
          {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
          {/* LISTE DES ARTICLES */}
          {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={[
                  globalStyles.card,
                  {
                    flexDirection: "row",
                    marginBottom: 16,
                    alignItems: "center",
                  },
                ]}
              >
                <Image
                  source={{ uri: getImageUrl(item.image) }}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    backgroundColor: colors.gray[200],
                  }}
                />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={[
                      globalStyles.body,
                      {
                        fontWeight: "600",
                        color: colors.text.primary,
                        marginBottom: 4,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={[
                      globalStyles.caption,
                      { color: colors.text.secondary, marginBottom: 8 },
                    ]}
                  >
                    {formatPrice(item.price)}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Quantités */}
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                        <Ionicons
                          name="remove"
                          size={16}
                          color={colors.text.primary}
                        />
                      </TouchableOpacity>

                      <Text
                        style={[
                          globalStyles.body,
                          {
                            marginHorizontal: 16,
                            color: colors.text.primary,
                            fontWeight: "600",
                            minWidth: 20,
                            textAlign: "center",
                          },
                        ]}
                      >
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
                        <Ionicons
                          name="add"
                          size={16}
                          color={colors.text.primary}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Total ligne */}
                    <Text
                      style={[
                        globalStyles.body,
                        { fontWeight: "600", color: colors.primary },
                      ]}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </View>
                </View>

                {/* Supprimer */}
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={{ padding: 8, marginLeft: 8 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
          {/* RÉCAP + VALIDATION */}
          {/* ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ */}
          <View
            style={{
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: colors.border.light,
              backgroundColor: colors.background.tertiary,
            }}
          >
            {/* Sous-total */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={[
                  globalStyles.body,
                  { color: colors.text.secondary },
                ]}
              >
                Sous-total
              </Text>
              <Text
                style={[globalStyles.body, { color: colors.text.primary }]}
              >
                {formatPrice(totalPrice())}
              </Text>
            </View>

            {/* Livraison */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text
                style={[
                  globalStyles.body,
                  { color: colors.text.secondary },
                ]}
              >
                Livraison
              </Text>
              <Text
                style={[globalStyles.body, { color: colors.success }]}
              >
                à déterminer
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: colors.border.light,
                marginVertical: 12,
              }}
            />

            {/* Total */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text
                style={[
                  globalStyles.subtitle,
                  { color: colors.text.primary },
                ]}
              >
                Total
              </Text>
              <Text
                style={[globalStyles.subtitle, { color: colors.primary }]}
              >
                {formatPrice(totalPrice())}
              </Text>
            </View>

            {/* Bouton Valider */}
            <TouchableOpacity
              style={[
                globalStyles.buttonPrimary,
                isProcessing && { opacity: 0.6 },
              ]}
              onPress={confirmOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <ActivityIndicator size="small" color={colors.white} />
                  <Text
                    style={[
                      globalStyles.buttonPrimaryText,
                      { marginLeft: 8 },
                    ]}
                  >
                    Traitement...
                  </Text>
                </View>
              ) : (
                <Text style={globalStyles.buttonPrimaryText}>
                  Valider la commande
                </Text>
              )}
            </TouchableOpacity>

            {/* Message d'information */}
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
              {"\n"}
              Les commandes passées après 18h peuvent être livrées le lendemain.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
