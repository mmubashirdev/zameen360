import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import WelcomePage from "../pages/WelcomePage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import GoogleCallbackPage from "../pages/GoogleCallbackPage"; // ← Add
import AuthFlow from "../components/AuthFlow";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      
      {/* ✅ Google OAuth callback */}
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      
      <Route path="/forgot-password" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthFlow />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}