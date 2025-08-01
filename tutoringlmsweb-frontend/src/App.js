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


const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  useEffect(() => {
    const fetchCurrentUserOnLoad = async () => {
      const token = cookie.load('token');
      if (!token) {
        dispatch({ type: 'LOGOUT' }); 
        return;
      }

      // try {
      //   const api = authApis();
      //   const res = await api.get('/auth/me');
      //   dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      // } catch (error) {
      //   console.error('Lỗi lấy thông tin user hiện tại:', error);
      //   dispatch({ type: 'LOGOUT' });
      // }
    };

    fetchCurrentUserOnLoad();
  }, []); 
  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Container>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Container>
          <Footer />
        </BrowserRouter>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;
