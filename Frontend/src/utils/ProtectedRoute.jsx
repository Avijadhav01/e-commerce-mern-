import React, { useEffect } from 'react'
import { useSelector } from "react-redux"
import Loader from "../components/Loader";
import { Navigate } from "react-router-dom"

function ProtectedRoute({ element, adminOnly = false }) {
  const { user, isAuthenticated, isAuthChecked } = useSelector((state) => state.user);

  // Wait until authentication is checked
  if (!isAuthChecked) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return element;
}


export default ProtectedRoute;