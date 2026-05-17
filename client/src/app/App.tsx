import AppRouter from "./Router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@features/auth/context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
