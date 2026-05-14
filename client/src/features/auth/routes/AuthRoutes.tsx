import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import AuthFlow from "../components/AuthFlow";
// import VerifyEmailPage from "../pages/VerifyEmailPage";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* <Route path="/verify-email" element={<VerifyEmailPage />} /> */}
      <Route path="/forgot-password" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthFlow />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
