import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    ios: {
      background: string;
      card: string;
      separator: string;
      blue: string;
      gray: string;
      gray2: string;
      gray3: string;
      gray4: string;
      gray5: string;
      gray6: string;
    };
  }
  interface PaletteOptions {
    ios?: {
      background: string;
      card: string;
      separator: string;
      blue: string;
      gray: string;
      gray2: string;
      gray3: string;
      gray4: string;
      gray5: string;
      gray6: string;
    };
  }
}

export const iosTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#007AFF',
      light: '#5AC8FA',
      dark: '#0040DD',
    },
    background: {
      default: '#F2F2F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#3C3C4399',
    },
    ios: {
      background: '#F2F2F7',
      card: '#FFFFFF',
      separator: '#C6C6C8',
      blue: '#007AFF',
      gray: '#8E8E93',
      gray2: '#AEAEB2',
      gray3: '#C7C7CC',
      gray4: '#D1D1D6',
      gray5: '#E5E5EA',
      gray6: '#F2F2F7',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '22px',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '17px',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '16px',
      fontWeight: 400,
    },
    body1: {
      fontSize: '17px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '15px',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '17px',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          backgroundColor: '#F2F2F7',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          border: `1px solid #C6C6C8`,
          borderRadius: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          boxShadow: 'none',
          borderBottom: `1px solid #C6C6C8`,
        },
      },
    },
    // iOS-style Switch
    MuiSwitch: {
  styleOverrides: {
    root: {
      width: 51,
      height: 31,
      padding: 0,
      '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
          transform: 'translateX(20px)',
          color: '#fff',
          '& + .MuiSwitch-track': {
            backgroundColor: '#34C759',
            opacity: 1,
            border: 0,
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: '#FFFFFF',
          },
        },
        '&.Mui-disabled': {
          '& .MuiSwitch-thumb': {
            backgroundColor: '#F2F2F7',
          },
          '& + .MuiSwitch-track': {
            opacity: 0.3,
            backgroundColor: '#E9E9EA',
          },
        },
      },
      '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 27,
        height: 27,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
      },
      '& .MuiSwitch-track': {
        borderRadius: 31 / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: 'background-color 300ms',
      },
    },
  },
},
    // iOS-style Slider
    MuiSlider: {
  styleOverrides: {
    root: {
      height: 2,
      padding: '15px 0',
      '& .MuiSlider-rail': {
        height: 2,
        backgroundColor: '#C7C7CC',
        opacity: 1,
        borderRadius: 1,
      },
      '& .MuiSlider-track': {
        height: 2,
        backgroundColor: '#007AFF',
        borderRadius: 1,
        border: 'none',
      },
      '& .MuiSlider-thumb': {
        height: 28,
        width: 28,
        backgroundColor: '#FFFFFF',
        border: '2px solid #007AFF',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        '&:hover, &.Mui-focusVisible': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        },
        '&.Mui-active': {
          boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
        },
      },
      '& .MuiSlider-mark': {
        backgroundColor: '#C7C7CC',
        height: 8,
        width: 1,
        '&.MuiSlider-markActive': {
          backgroundColor: '#007AFF',
        },
      },
      '& .MuiSlider-valueLabel': {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
      },
    },
  },
},
    // iOS-style Button
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '12px 20px',
          fontSize: '17px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#007AFF',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#0056CC',
          },
        },
        outlined: {
          borderColor: '#C7C7CC',
          color: '#007AFF',
          '&:hover': {
            borderColor: '#007AFF',
            backgroundColor: 'rgba(0, 122, 255, 0.04)',
          },
        },
        text: {
          color: '#007AFF',
          '&:hover': {
            backgroundColor: 'rgba(0, 122, 255, 0.04)',
          },
        },
      },
    },
    // iOS-style TextField
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#C7C7CC',
            },
            '&:hover fieldset': {
              borderColor: '#007AFF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#007AFF',
            },
          },
        },
      },
    },
    // iOS-style Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '14px',
          margin: '20px',
          maxWidth: 'calc(100% - 40px)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '17px',
          fontWeight: 600,
          textAlign: 'center',
          padding: '16px 20px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '0 20px 20px',
          flexDirection: 'column',
          gap: '8px',
          '& .MuiButton-root': {
            margin: 0,
            width: '100%',
          },
        },
      },
    },
    MuiLinearProgress: {
  styleOverrides: {
    root: {
      height: 6,
      borderRadius: 3,
      backgroundColor: '#E5E5EA',
    },
    bar: {
      borderRadius: 3,
      backgroundColor: '#007AFF',
    },
  },
},
    // iOS-style List
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '0 16px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '12px 16px',
          margin: '4px 0',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
});