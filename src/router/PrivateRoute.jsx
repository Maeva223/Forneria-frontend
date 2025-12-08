// src/router/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isAuth = !!localStorage.getItem("access"); // revisa si hay token
  return isAuth ? children : <Navigate to="/login" replace />;
}
