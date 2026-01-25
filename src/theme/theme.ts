import { alpha, createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#f6c945",
      contrastText: "#101010",
    },
    secondary: {
      main: "#5bc0eb",
    },
    background: {
      default: "#0f1116",
      paper: "#151924",
    },
    text: {
      primary: "#f5f7fb",
      secondary: "#9aa5b8",
    },
    error: {
      main: "#ef5350",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "var(--font-body)",
    h1: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "3rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "2.4rem",
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "2rem",
    },
    h4: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "var(--font-display)",
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.01em",
      textTransform: "none",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0f1116",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingLeft: 20,
          paddingRight: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(135deg, ${alpha(
            "#1e2231",
            0.92
          )} 0%, ${alpha("#141826", 0.98)} 100%)`,
          border: `1px solid ${alpha("#ffffff", 0.06)}`,
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(12px)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(135deg, ${alpha(
            "#1b1f2c",
            0.95
          )} 0%, ${alpha("#141826", 0.98)} 100%)`,
          border: `1px solid ${alpha("#ffffff", 0.06)}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: alpha("#0f1116", 0.5),
        },
        notchedOutline: {
          borderColor: alpha("#ffffff", 0.12),
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(8px)",
          backgroundImage: "none",
          backgroundColor: alpha("#0f1116", 0.6),
          borderBottom: `1px solid ${alpha("#ffffff", 0.06)}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha("#ffffff", 0.08),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});
