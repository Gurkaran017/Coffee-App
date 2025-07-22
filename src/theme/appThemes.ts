// src/theme/appThemes.ts
import {
  MD3LightTheme,
  MD3DarkTheme,
  MD3Theme,
} from 'react-native-paper';
import { COLORS } from './theme';

export const AppDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: COLORS.primaryBlackHex,
    surface: COLORS.primaryDarkGreyHex,
    onSurface: COLORS.primaryWhiteHex,       // used for text on surfaces
    onBackground: COLORS.primaryWhiteHex,    // used for text on background
    primary: COLORS.primaryOrangeHex,
  },
};

export const AppLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#d7d4d4ff',
    surface: '#bcbbbbff',
    onSurface: COLORS.primaryBlackHex,
    onBackground: COLORS.primaryBlackHex,
    primary: COLORS.primaryOrangeHex,
  },
};
