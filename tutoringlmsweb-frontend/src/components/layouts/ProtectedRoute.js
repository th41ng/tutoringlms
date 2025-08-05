import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { MyUserContext } from '../../configs/Context';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useContext(MyUserContext); 

    console.log("🔐 ProtectedRoute - Context:", { user });
    console.log("✅ allowedRoles:", allowedRoles);
    
    if (!user || !allowedRoles.includes(user.role)) {
        console.warn("🚫 Truy cập bị từ chối. Chuyển về /login");
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;