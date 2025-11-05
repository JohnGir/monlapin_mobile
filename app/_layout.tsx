import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Permet d’intercepter les erreurs globales
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Définit l’écran de démarrage sur les tabs
  initialRouteName: '(tabs)',
};

// On empêche le SplashScreen de disparaître avant le chargement complet
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // S’il y a une erreur de chargement des polices, on la lève
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
    return null; // Rien n’est affiché tant que les polices ne sont pas prêtes
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme(); // light ou dark selon le téléphone

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Le dossier (tabs) contient les écrans principaux (Home, Panier, Profil) */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Pour les écrans modaux (par ex : détails produit, confirmation achat, etc.) */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
