/* eslint-disable react/prop-types */

import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const location = useLocation();
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const isLoggedIn = (loggedInUser === null) ? false: true;

  if (requireAuth && !isLoggedIn) {
    // User is not logged in, but the route requires authentication
    // Save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isLoggedIn) {
    // User is logged in, but trying to access login/signup pages
    // Redirect to the page they were on before, or home if there's no previous page
    const from = location.state?.from?.pathname || '/';
    console.log("is it working ....", location)
    return <Navigate to={from} replace />;
  }

  return children;
};

export default ProtectedRoute;