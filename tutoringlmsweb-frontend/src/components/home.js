import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid bg-light vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="mb-4">Chào mừng đến với Hệ thống Quản lý Lớp học</h1>
        <p className="mb-5">Hãy đăng nhập hoặc đăng ký để bắt đầu sử dụng hệ thống.</p>
        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <button className="btn btn-primary btn-lg"onClick={() => navigate('/login')}>
            Đăng nhập
          </button>
          <button className="btn btn-outline-primary btn-lg" onClick={() => navigate('/register')}>
            Đăng ký
          </button>
             <button className="btn btn-outline-primary btn-lg" onClick={() => navigate('/attendance')}>
            Điểm danh
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
