// frontend/src/App.jsx
import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Theme configuration
import { createAppTheme } from "./theme/muiTheme";

// Pages
import AppRoutes from "./routes/AppRoutes";
import TicketOptions from "./pages/TicketOptions";

const AppContent = () => {
  const { darkMode } = useTheme();

  const theme = useMemo(
    () => createAppTheme(darkMode ? "dark" : "light"),
    [darkMode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      <AuthProvider>
        <EventProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "12px",
                  background: darkMode ? "#1e293b" : "#ffffff",
                  color: darkMode ? "#f8fafc" : "#1e293b",
                },
              }}
            />

            <Routes>
              {/* Main App Routes */}
              <Route path="/*" element={<AppRoutes />} />

              {/* ✅ Ticket Options Page */}
              <Route
                path="/event/:eventId/tickets"
                element={<TicketOptions />}
              />
            </Routes>
          </Router>
        </EventProvider>
      </AuthProvider>
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
