import React from "react";
import { UserProvider } from "../features/marketplace/components/profile/UserContext";
import { AuthProvider } from "../features/auth/context/AuthContext";
import AppRouter from "./routes/Router";

const App: React.FC = () => {
  return (
    // AuthProvider must wrap everything so any component can use useAuthContext
    <AuthProvider>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
