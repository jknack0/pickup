import { createTheme } from '@mui/material/styles';

// Define our custom dark palette
const darkPalette = {
  main: '#0f1219', // Very dark navy/black
  light: '#1a1f2e', // Slightly lighter for hover states
  dark: '#0a0d12', // Even darker for contrast
  paper: '#1e2433', // Card/surface backgrounds
  divider: '#2d3548', // Border color
  text: '#8b95a9', // Muted text
  textActive: '#ffffff', // Active/bright text
  accent: '#6366f1', // Indigo accent
  accentLight: 'rgba(99, 102, 241, 0.1)', // Accent with transparency
  accentGlow: 'rgba(99, 102, 241, 0.3)', // For glow effects
};

const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

// Module augmentation for TypeScript
declare module '@mui/material/styles' {
  interface Palette {
    dark: {
      main: string;
      light: string;
      dark: string;
      paper: string;
      divider: string;
      text: string;
      textActive: string;
      accent: string;
      accentLight: string;
      accentGlow: string;
    };
  }
  interface PaletteOptions {
    dark?: {
      main: string;
      light: string;
      dark: string;
      paper: string;
      divider: string;
      text: string;
      textActive: string;
      accent: string;
      accentLight: string;
      accentGlow: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: darkPalette.accent, // Use indigo as primary
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: slate[500],
      light: slate[400],
      dark: slate[600],
      contrastText: '#ffffff',
    },
    background: {
      default: slate[50], // Very light cool gray
      paper: '#ffffff',
    },
    text: {
      primary: slate[900],
      secondary: slate[600],
    },
    divider: slate[200],
    // Custom dark palette for our dark theme sections
    dark: darkPalette,
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "sans-serif"',
    h1: { fontWeight: 700, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.025em' },
    h3: { fontWeight: 600, letterSpacing: '-0.025em' },
    h4: { fontWeight: 600, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: 'none',
          border: `1px solid ${slate[200]}`,
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          border: `1px solid ${slate[200]}`,
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
          border: `1px solid ${slate[200]}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: slate[300],
            },
            '&:hover fieldset': {
              borderColor: slate[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: darkPalette.accent,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: slate[900],
          boxShadow: 'none',
          borderBottom: `1px solid ${slate[200]}`,
        },
      },
    },
  },
});
