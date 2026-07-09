// client/src/features/admin/adminLogin/components/LoginForm.tsx
import { loginZodSchema } from "../utility/loginZodSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { adminLogin } from "../../services/adminApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type LoginFormData = z.infer<typeof loginZodSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginZodSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      const result = await adminLogin(data);

      // ✅ Just store the admin data — no token check needed
      if (!result.success || !result.data) {
        setError("Login failed. Please try again.");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(result.data));
      navigate("/admin");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full lg:w-1/2 flex flex-col min-h-screen lg:min-h-0">
      <div className="flex-1 flex items-center justify-center px-6 pb-8 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-600 leading-tight pt-15">
              Welcome Back
              <br />
              Admin
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in your account</p>
          </div>

          {/* ✅ Show error if login fails */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5 pb-5">
            <div>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
