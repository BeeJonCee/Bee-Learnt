import { alpha, createTheme, type PaletteMode } from "@mui/material/styles";

const brand = {
  yellow: "#FFD600",
  dark: "#121212",
  graphite: "#1A1A1A",
  offWhite: "#E0E0E0",
  white: "#FFFFFF",
  accent: "#2B2B2B",
};

export function getTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brand.yellow,
        contrastText: "#121212",
      },
      secondary: {
        main: isDark ? "#5BC0EB" : "#1976d2",
      },
      background: {
        default: isDark ? brand.dark : brand.white,
        paper: isDark ? brand.graphite : "#F7F7F7",
      },
      text: {
        primary: isDark ? brand.offWhite : "#1E1E1E",
        secondary: isDark ? "#B0B0B0" : "#4B5563",
      },
      divider: isDark ? brand.accent : "#E5E7EB",
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: "var(--font-body)",
      h1: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h2: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
      },
      h3: {
        fontFamily: "var(--font-display)",
        fontWeight: 700,
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
        fontFamily: "var(--font-ui)",
        fontWeight: 600,
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? brand.dark : brand.white,
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
            backgroundImage: isDark
              ? `linear-gradient(135deg, ${alpha("#1f1f1f", 0.95)} 0%, ${alpha(
                  "#161616",
                  0.98
                )} 100%)`
              : "none",
            border: `1px solid ${alpha(isDark ? brand.white : "#000", isDark ? 0.06 : 0.08)}`,
            boxShadow: isDark
              ? "0 24px 60px rgba(0, 0, 0, 0.35)"
              : "0 16px 40px rgba(15, 15, 15, 0.08)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${alpha(isDark ? brand.white : "#000", isDark ? 0.06 : 0.08)}`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark
              ? alpha(brand.dark, 0.4)
              : alpha(brand.white, 0.7),
          },
          notchedOutline: {
            borderColor: alpha(isDark ? brand.white : "#000", 0.12),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(8px)",
            backgroundImage: "none",
            backgroundColor: alpha(isDark ? brand.dark : brand.white, 0.85),
            borderBottom: `1px solid ${alpha(isDark ? brand.white : "#000", 0.06)}`,
          },
        },
      },
    },
  });
}
