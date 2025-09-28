import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    header: {
      main: string;
    };
    sidebar: {
      main: string;
    };
  }
  interface PaletteOptions {
    header?: {
      main: string;
    };
    sidebar?: {
      main: string;
    };
  }
}

const baseTheme = {
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`,
  },
  shape: {
    borderRadius: 10,
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF', // macOS system blue
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
    header: {
      main: 'rgba(255, 255, 255, 0.8)',
    },
    sidebar: {
      main: 'rgba(245, 245, 247, 0.8)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          color: '#000',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
  },
});

// Аналогично создаём darkTheme
export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#0A84FF', // Более яркий синий для темной темы macOS
    },
    background: {
      default: '#1C1C1E', // Темно-серый фон
      paper: '#2C2C2E',   // Чуть более светлый для поверхностей
    },
    text: {
      primary: '#FFFFFF', // Белый основной текст
      secondary: 'rgba(255, 255, 255, 0.7)', // Слегка прозрачный белый
    },
    header: {
      main: 'rgba(30, 30, 32, 0.8)', // Темный полупрозрачный
    },
    sidebar: {
      main: 'rgba(28, 28, 30, 0.8)', // Темный полупрозрачный
    },
    divider: 'rgba(255, 255, 255, 0.1)', // Светлый деликатор
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 30, 32, 0.8)',
          backdropFilter: 'blur(20px)',
          color: '#FFF',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(44, 44, 46, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Убираем капс как в macOS
          borderRadius: 6,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    // Дополнительные кастомизации для тёмной темы
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 8,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
});