import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPlaceholder />}
      />
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function ForgotPasswordPlaceholder() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Poppins, sans-serif",
        fontSize: 18,
        color: "#64748b",
      }}
    >
      Forgot Password
    </div>
  );
}
