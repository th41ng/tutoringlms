import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { MyUserContext } from '../../configs/Context';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useContext(MyUserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu có cấu hình allowedRoles thì mới check role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/login" />;
    }
  }

  return children;
};


export default ProtectedRoute;