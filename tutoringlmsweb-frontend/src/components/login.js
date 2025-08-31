
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { MyDispatchContext } from "../configs/Context";
import axios, { endpoints } from '../configs/Apis';

const Login = () => {
  const dispatch = useContext(MyDispatchContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await axios.post(endpoints.login, { username, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { token, username: returnedUsername, role } = res.data;

      
      cookie.remove('token');


      cookie.save('token', token);
      dispatch({ type: 'login', payload: { username: returnedUsername, role } });

      if (role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'ROLE_TEACHER') {
        navigate('/teacher/dashboard');
      } else if (role === 'ROLE_STUDENT') {
        navigate('/student/home');
      } else {
        navigate('/');
      }

    } catch (error) {
      setErrorMsg(error.response?.data || 'Đăng nhập thất bại');
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên đăng nhập:</label><br />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Mật khẩu:</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
