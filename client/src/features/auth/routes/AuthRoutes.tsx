import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import GoogleCallbackPage from "../pages/GoogleCallbackPage";
import AuthFlow from "../components/AuthFlow";
import SocietySetupPasswordPage from "../pages/SocietySetupPasswordPage";
import ProtectedRoute from "../../../app/routes/protectedRoute";

const authRoutes = [
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/signup",
    element: <SignupPage />,
  },

  {
    path: "/verify-email",
    element: (
      <ProtectedRoute>
        <VerifyEmailPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/auth/google/callback",
    element: (
      <ProtectedRoute>
        <GoogleCallbackPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/forgot-password",
    element: (
      <ProtectedRoute>
        <AuthFlow initialStep={1} />
      </ProtectedRoute>
    ),
  },

  {
    path: "/auth",
    element: (
      <ProtectedRoute>
        <AuthFlow />
      </ProtectedRoute>
    ),
  },
  {
    path: "/society-setup-password",
    element: (
      <ProtectedRoute>
        <SocietySetupPasswordPage />
      </ProtectedRoute>
    ),
  },
];

export default authRoutes;
