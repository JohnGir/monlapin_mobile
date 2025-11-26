// src/theme/colors.ts
export const colors = {
  // Couleur principale verte
  primary: '#1F4627',
  
  // Variations de la couleur principale
  primaryDark: '#16381E',
  primaryLight: '#2A5C35',
  primaryLighter: '#3A7A4A',
  
  // Couleurs d'accent
  accent: '#00A86B',
  accentDark: '#008554',
  accentLight: '#00C47A',
  
  // Couleurs neutres
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // États
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Arrière-plans
  background: {
    primary: '#1F4627',
    secondary: '#FFFFFF',
    tertiary: '#F9FAFB',
  },
  
  // Textes
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
    onPrimary: '#FFFFFF',
  },
  
  // Bordures
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  }
} as const;

export type Colors = typeof colors;