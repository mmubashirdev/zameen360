// client/src/features/admin/adminLogin/components/LoginForm.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput"; // ✅ FIXED PATH
import LoginButton from "./LoginButton";

const LoginForm = () => {

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // ========================================
  // FORM SUBMISSION HANDLER
  // Developer: Implement your login logic here
  // ========================================
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    // Basic validation
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    // TODO: Implement actual login logic (API call)
    // Example:
    // setIsLoading(true);
    // try {
    //   const response = await adminAuthService.login(email, password);
    //   
    //   navigate('/admin');
    // } catch (error) {
    //   setErrors({ email: 'Invalid credentials', password: '' });
    // } finally {
    //   setIsLoading(false);
    // }
  };


  return (
    <div className="w-full lg:w-1/2 flex flex-col min-h-screen lg:min-h-0">

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-8 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-600 leading-tight pt-15">
              Welcome Back
              <br />
              Admin
            </h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5 pb-5">
            <EmailInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="pt-2">
              <LoginButton isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
