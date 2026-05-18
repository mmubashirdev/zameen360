// import { Navigate } from "react-router-dom";
// import { useAuth } from "@features/auth/context/AuthContext";

// type Props = {
//   children: React.ReactNode;
// };

// const ProtectedRoute = ({ children }: Props)=>{
//   const { user, isAuthenticated } = useAuth();
//   const isAuthenticated = localStorage.getItem("token") ? true : false;

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }

// export default ProtectedRoute;
