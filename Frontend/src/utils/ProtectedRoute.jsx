import React, { useEffect } from 'react'
import { useSelector } from "react-redux"
import Loader from "../components/Loader";
import { Navigate } from "react-router-dom"

function ProtectedRoute({ element }) {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
  }

  return element;
}


export default ProtectedRoute;