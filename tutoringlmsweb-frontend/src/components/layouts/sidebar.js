import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MyUserContext } from '../../configs/Context';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const { user, loading } = useContext(MyUserContext); 
  const location = useLocation();

  if (loading || !user) return null; 

  let menuItems = [];

  if (user.role === "ROLE_ADMIN") {
    menuItems = [
      { to: "/admin/dashboard", label: "Dashboard Admin" },
    ];
  } else if (user.role === "ROLE_TEACHER") {
    menuItems = [
      { to: "/teacher/dashboard", label: "Trang chủ" },
      { to: "/teacher/classroom", label: "Lớp học" },
      { to: "/assignments/all", label: "Bài tập" },
      { to: "", label: "Học sinh" },
      { to: "", label: "Diễn đàn" },
    ];
  } else if (user.role === "ROLE_STUDENT") {
    menuItems = [
      { to: "/student/home", label: "Trang chủ học sinh" },
      { to: "", label: "Bài tập" },
      { to: "", label: "Diễn đàn" },
      { to: "", label: "Thanh toán" },
    ];
  }

  return (
    <div className="bg-white border-end vh-100 shadow-sm p-3" style={{ minWidth: "220px" }}>
      <div className="mb-4">
        <h5 className="text-primary fw-bold">Chức năng</h5>
        <hr />
      </div>
      <ul className="nav flex-column">
        {menuItems.map((item, idx) => (
          <li className="nav-item mb-2" key={idx}>
            <Link
              to={item.to}
              className={`nav-link px-3 py-2 rounded ${location.pathname === item.to ? 'bg-primary text-white' : 'text-dark'}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
