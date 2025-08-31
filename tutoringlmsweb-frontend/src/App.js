import React, { useReducer, useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import cookie from 'react-cookies';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import MyUserReducer from './reducers/MyUserReducer';
import { MyUserContext, MyDispatchContext } from './configs/Context';
import { authApis, endpoints } from './configs/Apis';
import ProtectedRoute from './components/layouts/ProtectedRoute';

// Lazy load components
const Header = lazy(() => import('./components/layouts/header'));
const Footer = lazy(() => import('./components/layouts/footer'));
const Sidebar = lazy(() => import('./components/layouts/sidebar'));

const Home = lazy(() => import('./components/home'));
const Login = lazy(() => import('./components/login'));
const Register = lazy(() => import('./components/register'));

const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

const TeacherDashboard = lazy(() => import('./components/Teacher/TeacherDashboard'));
const TeacherClassroom = lazy(() => import('./components/Teacher/TeacherClassroom'));
const TeacherClassroomDetail = lazy(() => import('./components/Teacher/TeacherClassroomDetail'));
const CreateEsssayAssign = lazy(() => import('./components/Teacher/CreateEssayAssign'));
const CreateMCAssignment = lazy(() => import('./components/Teacher/CreateMCAssignment'));
const EditMCAssignment = lazy(() => import('./components/Teacher/EditMCAssignment'));
const TeacherAssignments = lazy(() => import('./components/Teacher/TeacherAssigment'));
const ViewSubmissions = lazy(() => import('./components/Teacher/ViewSubmissions'));
const Anoucement = lazy(() => import('./components/Teacher/TeacherAnnouncements'));
const Forum = lazy(() => import('./components/Teacher/ForumList'));
const ForumDetail = lazy(() => import('./components/Teacher/ForumDetail'));
const TeacherPaymentInfo = lazy(() => import('./components/Teacher/TeacherPaymentInfo'));
const ClassroomPaymentsPage = lazy(() => import('./components/Teacher/ClassroomPaymentsPage'));
const ClassroomPaymentDetail = lazy(() => import('./components/Teacher/ClassroomPaymentDetail'));

const StudentHome = lazy(() => import('./components/Student/StudentHome'));
const AssignmentsList = lazy(() => import('./components/Student/AssignmentsList'));
const EssayAssignmentPage = lazy(() => import('./components/Student/EssayAssignmentPage'));
const MultipleChoiceAssignmentPage = lazy(() => import('./components/Student/MultipleChoiceAssignmentPage'));
const StudentPaymentsPage = lazy(() => import('./components/Student/StudentPaymentsPage'));

const FaceAttendance = lazy(() => import('./components/FaceAttendance'));
const FaceEnroll = lazy(() => import('./components/FaceEnroll'));

// Memoized layout components
const MemoHeader = React.memo(Header);
const MemoFooter = React.memo(Footer);
const MemoSidebar = React.memo(Sidebar);

const AppRoutes = () => {
  const location = useLocation();
  const hideSidebarPaths = ['/', '/login', '/register'];
  const showSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <Suspense fallback={<h3 className="text-center mt-5">Đang tải...</h3>}>
      <MemoHeader />
      <div className="d-flex">
        {showSidebar && <MemoSidebar />}
        <Container className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Teacher */}
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
            <Route path="/view-submissions/:assignmentId" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <ViewSubmissions />
              </ProtectedRoute>
            } />
            <Route path="/forum/all" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <Forum />
              </ProtectedRoute>
            } />
            <Route path="/forum/mine" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <Forum />
              </ProtectedRoute>
            } />
            <Route path="/forums/:id" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER','ROLE_STUDENT']}>
                <ForumDetail />
              </ProtectedRoute>
            } />
            <Route path="/payment_info" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <TeacherPaymentInfo />
              </ProtectedRoute>
            } />
            <Route path="/classroom-payment" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <ClassroomPaymentsPage />
              </ProtectedRoute>
            } />
            <Route path="/classroom-payment-detail/:id" element={
              <ProtectedRoute allowedRoles={['ROLE_TEACHER']}>
                <ClassroomPaymentDetail />
              </ProtectedRoute>
            } />
            <Route path="/anoucements/all" element={
              <Anoucement allowedRoles={['ROLE_TEACHER']} />
            } />

            {/* Student */}
            <Route path="/student/home" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <StudentHome />
              </ProtectedRoute>
            } />
            <Route path="/student/assignments" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <AssignmentsList />
              </ProtectedRoute>
            } />
            <Route path="/student/essay/:assignmentId" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <EssayAssignmentPage />
              </ProtectedRoute>
            } />
            <Route path="/student/mc/:assignmentId" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <MultipleChoiceAssignmentPage />
              </ProtectedRoute>
            } />
            <Route path="/student/payments" element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                <StudentPaymentsPage />
              </ProtectedRoute>
            } />

            {/* Attendance */}
            <Route path="/attendance" element={<FaceAttendance />} />
            <Route path="/attendance/register-face" element={<FaceEnroll />} />
          </Routes>
        </Container>
      </div>
      <MemoFooter />
    </Suspense>
  );
};

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = cookie.load('token');

    const clearState = () => {
      dispatch({ type: 'logout' });
      cookie.remove('token');
      localStorage.removeItem('user');
      setLoading(false);
    };

    if (!token) {
      clearState();
      return;
    }

    try {
      const res = await authApis().get(endpoints.currentUser);
      dispatch({ type: 'login', payload: res.data });
    } catch (err) {
      clearState();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <MyUserContext.Provider value={{ user, loading }}>
      <MyDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          {loading ? <h3 className="text-center mt-5">Đang tải...</h3> : <AppRoutes />}
        </BrowserRouter>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;
