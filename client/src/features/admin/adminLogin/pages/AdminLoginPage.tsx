// src/pages/AdminLoginPage.jsx

import PropertyImagePanel from "../components/PropertyImagePanel";
import LoginForm from "../components/LoginForm";

const AdminLoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 lg:p-6">
      {/* Main Container Card */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-700px">
        {/* Left Side - Property Image Panel */}
        <PropertyImagePanel />

        {/* Right Side - Login Form */}
        <LoginForm />
      </div>
    </div>
  );
};

export default AdminLoginPage;
