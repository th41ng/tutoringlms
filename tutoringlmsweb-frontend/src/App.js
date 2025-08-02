import React, { useReducer, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import cookie from 'react-cookies';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from "react-bootstrap";

import Header from "./components/layouts/header";
import Footer from "./components/layouts/footer";

import MyUserReducer from './reducers/MyUserReducer';
import { MyUserContext, MyDispatchContext } from './configs/Context';
import axios, { authApis, endpoints } from './configs/Apis';

import Login from "./components/login";
import Register from "./components/register";
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from "./components/layouts/ProtectedRoute";
import TeacherDashboard from './components/Teacher/TeacherDashboard';

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
        const res = await authApis().get(endpoints['current_user']);
        dispatch({ type: 'login', payload: res.data });
      } catch (err) {
        dispatch({ type: 'logout' });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUserOnLoad();
  }, []);

  if (loading) return <h3>Loading...</h3>;

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Container>
            <Routes>
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
            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;
