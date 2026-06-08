// client/src/app/App.tsx
import React from "react";
import { UserProvider } from "../features/marketplace/components/profile/UserContext";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { PropertyProvider } from "../features/marketplace/components/context/PropertyContext"; // ⭐ ADD
import AppRouter from "./routes/Router";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UserProvider>
        {/* ⭐ Wrap router with PropertyProvider */}
        <PropertyProvider>
          <AppRouter />
        </PropertyProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;