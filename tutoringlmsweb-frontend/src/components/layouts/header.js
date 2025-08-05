import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyUserContext, MyDispatchContext } from '../../configs/Context';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const { user, loading } = useContext(MyUserContext);  // ✅ Lấy cả user và loading
  const dispatch = useContext(MyDispatchContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "logout" });
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <Link className="navbar-brand" to="/">Hệ thống LMS</Link>

        {!loading && user && (
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <span className="nav-link text-white">
                  Xin chào, <strong>{user.username}</strong>
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
