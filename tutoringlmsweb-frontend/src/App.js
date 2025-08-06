
import React, { useReducer, useEffect, useState } from 'react';
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
import CreateEsssayAssign from './components/Teacher/CreateEssayAssign';
import CreateMCAssignment from './components/Teacher/CreateMCAssignment';
import EditMCAssignment from './components/Teacher/EditMCAssignment';
import TeacherClassroomDetail from './components/Teacher/TeacherClassroomDetail';

import Forum from './components/Teacher/ForumList';
import StudentHome from './components/Student/StudentHome';
import ProtectedRoute from './components/layouts/ProtectedRoute';
import ForumDetail from './components/Teacher/ForumDetail';
import MyUserReducer from './reducers/MyUserReducer';
import { MyUserContext, MyDispatchContext } from './configs/Context';
import { authApis, endpoints } from './configs/Apis';
import TeacherAssignments from './components/Teacher/TeacherAssigment';


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
            <Route path="/teacher/classroom/:id" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <TeacherClassroomDetail />
              </ProtectedRoute>
            } />
            <Route path="/assignments/all" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <TeacherAssignments />
              </ProtectedRoute>
            } />
            <Route path="/create-essay-assignment" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <CreateEsssayAssign />
              </ProtectedRoute>
            } />
            <Route path="/create-mc-assignment" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <CreateMCAssignment />
              </ProtectedRoute>
            } />
            <Route path="/edit-mc-assignment/:id" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <EditMCAssignment />
              </ProtectedRoute>
            } />
            <Route path="/forum/mine" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <Forum />
              </ProtectedRoute>
            } />
            <Route path="/forum/all" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <Forum />
              </ProtectedRoute>
            } />
            <Route path="/forum/posts/my-class" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <Forum />
              </ProtectedRoute>
            } />
            <Route path="/forums/:id" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER', 'ROLE_STUDENT']}>
                <ForumDetail />
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = cookie.load("token");
      const clearStateAndCookies = () => {
        dispatch({ type: "logout" });
        cookie.remove("token");
        localStorage.removeItem('user');
        setLoading(false);
      };
      if (!token) {
        console.warn("⚠️ Không có token => dọn dẹp");
        clearStateAndCookies();
        return;
      }
      try {
        const res = await authApis().get(endpoints.current_user);
        console.log("✅ User hiện tại:", res.data);
        dispatch({ type: "login", payload: res.data });
      } catch (err) {
        console.error("❌ Lỗi khi gọi /auth/me:", err);
        clearStateAndCookies();
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <MyUserContext.Provider value={{ user, loading }}>
      <MyDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {loading ? (
            <h3 className="text-center mt-5">Đang tải...</h3>
          ) : (
            <AppRoutes />
          )}
        </BrowserRouter>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;