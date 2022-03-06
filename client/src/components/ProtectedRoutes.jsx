import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/auth-context";


// receives component and any other props represented by ...rest
export default function ProtectedRoutes({children }) {
  const { isLoggedIn } = useAuth();

  return (

    isLoggedIn ? children : <Navigate to="/" />

    
  );
}
