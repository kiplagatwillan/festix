import React, { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext"; // ✅ Now being used

// Theme configuration
import { createAppTheme } from "./theme/muiTheme";

// Pages & Routes
import AppRoutes from "./routes/AppRoutes";
import TicketOptions from "./pages/TicketOptions";
import PaymentPage from "./pages/PaymentPage"; // ✅ Import your new Payment Page

const AppContent = () => {
  const { darkMode } = useTheme();

  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(
    () => createAppTheme(darkMode ? "dark" : "light"),
    [darkMode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      {/* Context Hierarchy: 
          1. Auth (User) 
          2. Events (Data) 
          3. Cart (Transactions) 
      */}
      <AuthProvider>
        <EventProvider>
          <CartProvider>
            {" "}
            {/* ✅ WRAPPED: IDE warning will disappear */}
            <Router>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: "16px",
                    padding: "16px",
                    background: darkMode ? "#1e293b" : "#ffffff",
                    color: darkMode ? "#f8fafc" : "#1e293b",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  },
                }}
              />

              <Routes>
                {/* Dynamic Ticket Selection
                 */}
                <Route
                  path="/event/:eventId/tickets"
                  element={<TicketOptions />}
                />

                {/* ✅ SECURE CHECKOUT ROUTE
                   This ensures your navigate('/checkout/payment') has a destination
                */}
                <Route path="/checkout/payment" element={<PaymentPage />} />

                {/* Main App Routes (Home, Profile, etc.)
                   This catch-all should usually be last
                */}
                <Route path="/*" element={<AppRoutes />} />
              </Routes>
            </Router>
          </CartProvider>
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
