import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { MyUserContext } from '../../configs/Context';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = useContext(MyUserContext);

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
