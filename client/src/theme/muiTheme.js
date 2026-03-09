import { createTheme } from "@mui/material/styles";

/**
 * World-Class MUI Theme Configuration
 * Features:
 * 1. Adaptive Dark/Light Palette
 * 2. Premium Typography Scale (using Inter)
 * 3. Component Overrides for "SQUIRCLE" (Rounded) corners
 * 4. High-Fidelity Elevation/Shadows
 */

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: "#6366f1", // Indigo 600
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a855f7", // Purple 500
      light: "#c084fc",
      dark: "#9333ea",
    },
    background: {
      default: mode === "light" ? "#f8fafc" : "#0f172a", // Slate 50 vs Slate 900
      paper: mode === "light" ? "#ffffff" : "#1e293b", // White vs Slate 800
    },
    text: {
      primary: mode === "light" ? "#1e293b" : "#f8fafc",
      secondary: mode === "light" ? "#64748b" : "#94a3b8",
    },
    divider: mode === "light" ? "#e2e8f0" : "#334155",
  },
  typography: {
    fontFamily: ["Inter", "system-ui", "-apple-system", "sans-serif"].join(","),
    h1: { fontWeight: 900, fontSize: "3.5rem", letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, fontSize: "2.25rem", letterSpacing: "-0.01em" },
    h3: { fontWeight: 700, fontSize: "1.875rem" },
    button: {
      textTransform: "none", // Industry standard: No all-caps buttons
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16, // Modern "Squircle" feel
  },
  components: {
    // World-Class Button Styling
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 24px",
          transition: "all 0.2s ease-in-out",
          boxShadow: "none",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        },
      },
    },
    // Premium Card Styling
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // Remove MUI's default dark mode overlay
          border: mode === "light" ? "1px solid #e2e8f0" : "1px solid #334155",
          boxShadow:
            mode === "light"
              ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              : "0 10px 15px -3px rgb(0 0 0 / 0.3)",
        },
      },
    },
    // Modern Input Fields
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "light" ? "#ffffff" : "#0f172a",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6366f1",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: "2px",
          },
        },
      },
    },
  },
});

// Create the theme based on the current mode
export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
