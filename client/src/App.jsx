import React, { useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { EventProvider } from "./context/EventContext";

// Theme Configuration
import { createAppTheme } from "./theme/muiTheme";

// Routes Engine
import AppRoutes from "./routes/AppRoutes";

/**
 * The Root Component
 * Wraps the application in the necessary Context and Style Providers.
 */
const AppContent = () => {
  const { darkMode } = useTheme();

  // Memoize the MUI theme to prevent re-calculation on every render
  const theme = useMemo(
    () => createAppTheme(darkMode ? "dark" : "light"),
    [darkMode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline kicks off MUI's CSS reset to ensure consistent cross-browser rendering */}
      <CssBaseline />

      <EventProvider>
        <AuthProvider>
          <Router>
            {/* Industry-standard Notification System */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "12px",
                  background: darkMode ? "#1e293b" : "#ffffff",
                  color: darkMode ? "#f8fafc" : "#1e293b",
                  border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                },
              }}
            />

            {/* The actual routing logic */}
            <AppRoutes />
          </Router>
        </AuthProvider>
      </EventProvider>
    </MuiThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
