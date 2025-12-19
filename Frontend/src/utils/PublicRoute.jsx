import React from 'react'
import Loader from '../components/Loader';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PublicRoute({ element }) {

  const { isAuthenticated, loading } = useSelector((state) => state.user);
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/"

  if (loading) return <Loader />

  // If user is logged in, redirect to home or profile
  if (isAuthenticated) return <Navigate to={redirect} replace />


  return element
}

export default PublicRoute;
