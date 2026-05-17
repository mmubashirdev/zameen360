import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import GoogleCallbackPage from "../pages/GoogleCallbackPage";
import AuthFlow from "../components/AuthFlow";

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
    element: <VerifyEmailPage />,
  },

  {
    path: "/auth/google/callback",
    element: <GoogleCallbackPage />,
  },

  {
    path: "/auth",
    element: <AuthFlow />,
  },
];

export default authRoutes;
