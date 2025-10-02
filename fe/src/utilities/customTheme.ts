import { extendTheme } from '@mui/joy/styles';

export const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          50: '#f5e2dd', // Very light tint of #bf7258
          100: '#e8c5bb', // Light tint
          200: '#dca097', // Lighter tone
          300: '#cf7b72', // Light tone, slightly less saturated
          400: '#c96765', // Close to the main color but lighter
          500: '#bf7258', // Main color
          600: '#a45e4b', // Slightly darker
          700: '#874b3d', // Darker tone
          800: '#6b392f', // Deeper dark shade
          900: '#47261f', // Very dark shade
        },
      },
    },
    light: {
      palette: {
        primary: {
          50: '#f5e2dd', // Very light tint of #bf7258
          100: '#e8c5bb', // Light tint
          200: '#dca097', // Lighter tone
          300: '#cf7b72', // Light tone, slightly less saturated
          400: '#c96765', // Close to the main color but lighter
          500: '#bf7258', // Main color
          600: '#a45e4b', // Slightly darker
          700: '#874b3d', // Darker tone
          800: '#6b392f', // Deeper dark shade
          900: '#47261f', // Very dark shade
        },
      },
    },
  },
});
