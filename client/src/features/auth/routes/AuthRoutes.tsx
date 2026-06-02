import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import GoogleCallbackPage from "../pages/GoogleCallbackPage";
import AuthFlow from "../components/AuthFlow";
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
    element: <GoogleCallbackPage />,
  },

  {
    path: "/forgot-password",
    element: <AuthFlow initialStep={1} />,
  },

  {
    path: "/auth",
    element: <AuthFlow />,
  },
];

export default authRoutes;
