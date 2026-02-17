function PublicRoute({ element }) {

  const { isAuthenticated, isAuthChecked } =
    useSelector((state) => state.user);

  const location = useLocation();

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";

  // Wait until auth check finishes
  if (!isAuthChecked) return <Loader />;

  // If already logged in → redirect
  if (isAuthenticated)
    return <Navigate to={redirect} replace />;

  return element;
}
