import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { ThemeProvider } from '../src/theme/ThemeProvider'; // ⬅️ IMPORT DE VOTRE THEME

export {
  // Permet d'intercepter les erreurs globales
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Définit l'écran de démarrage sur les tabs
  initialRouteName: '(tabs)',
};

// On empêche le SplashScreen de disparaître avant le chargement complet
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // S'il y a une erreur de chargement des polices, on la lève
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Quand tout est chargé, on masque le SplashScreen
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Rien n'est affiché tant que les polices ne sont pas prêtes
  }

  return <RootLayoutNav />;
}

// Configuration du thème personnalisé avec votre couleur verte
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1F4627',        // Votre couleur verte principale
    background: '#FFFFFF',     // Fond blanc
    card: '#1F4627',          // En-têtes verts
    text: '#FFFFFF',          // Texte blanc sur fond vert
    border: '#E5E7EB',        // Bordures grises claires
    notification: '#00A86B',  // Notifications en vert accent
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#2A5C35',        // Version plus claire pour le dark mode
    background: '#111827',     // Fond sombre
    card: '#1F4627',          // Toujours votre vert en dark mode
    text: '#FFFFFF',          // Texte blanc
    border: '#374151',        // Bordures plus foncées
    notification: '#00C47A',  // Version plus claire pour le dark mode
  },
};

function RootLayoutNav() {
  const colorScheme = useColorScheme(); // light ou dark selon le téléphone

  return (
    <ThemeProvider> {/* ⬅️ VOTRE THEME PROVIDER */}
      <NavigationThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme}>
        <Stack
          screenOptions={{
            // Options globales pour tous les écrans
            headerStyle: {
              backgroundColor: '#1F4627', // Votre couleur verte
            },
            headerTintColor: '#FFFFFF', // Texte blanc
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerBackTitle: 'Retour',
            contentStyle: {
              backgroundColor: '#FFFFFF', // Fond blanc pour le contenu
            },
          }}
        >
          {/* Le dossier (tabs) contient les écrans principaux (Home, Panier, Profil) */}
          <Stack.Screen
            name="(tabs)"
            options={{ 
              headerShown: false,
            }}
          />

          {/* Pour les écrans modaux (par ex : détails produit, confirmation achat, etc.) */}
          <Stack.Screen
            name="modal"
            options={{ 
              presentation: 'modal', 
              headerShown: false,
            }}
          />

          {/* Écran de détails de catégorie */}
          <Stack.Screen
            name="category/[id]"
            options={({ route }: any) => ({
              title: 'Détails de la catégorie',
              headerStyle: {
                backgroundColor: '#1F4627',
              },
              headerTintColor: '#FFFFFF',
            })}
          />

          {/* Écran du panier */}
          <Stack.Screen
            name="cart"
            options={{
              title: 'Mon Panier',
              headerStyle: {
                backgroundColor: '#1F4627',
              },
              headerTintColor: '#FFFFFF',
            }}
          />

          {/* Écran de profil */}
          <Stack.Screen
            name="profile"
            options={{
              title: 'Mon Profil',
              headerStyle: {
                backgroundColor: '#1F4627',
              },
              headerTintColor: '#FFFFFF',
            }}
          />
        </Stack>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}