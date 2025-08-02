import React, { useReducer, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import cookie from 'react-cookies';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/layouts/header';
import Footer from './components/layouts/footer';
import Sidebar from './components/layouts/sidebar';

import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import TeacherClassroom from './components/Teacher/TeacherClassroom';
import StudentHome from './components/Student/StudentHome';
import ProtectedRoute from './components/layouts/ProtectedRoute';

import MyUserReducer from './reducers/MyUserReducer';
import { MyUserContext, MyDispatchContext } from './configs/Context';
import { authApis, endpoints } from './configs/Apis';

const AppRoutes = () => {
  const location = useLocation();
  const hideSidebarPaths = ['/', '/login', '/register'];
  const isAuthPage = hideSidebarPaths.includes(location.pathname);

  return (
    <>
      <Header />
      <div className="d-flex">
        {!isAuthPage && <Sidebar />}
        <Container className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/teacher/dashboard" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } />
              <Route path="/teacher/classroom" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <TeacherClassroom />
              </ProtectedRoute>
            } />

            <Route path="/student/home" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <StudentHome />
              </ProtectedRoute>
            } />
          </Routes>
        </Container>
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchCurrentUserOnLoad = async () => {
      const token = cookie.load('token');
      if (!token) {
        dispatch({ type: 'logout' });
        setLoading(false);
        return;
      }

      try {
        const res = await authApis().get(endpoints.current_user);
        dispatch({ type: 'login', payload: res.data });
      } catch {
        dispatch({ type: 'logout' });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUserOnLoad();
  }, []);

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;
