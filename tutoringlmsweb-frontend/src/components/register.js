import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints, default as axios } from '../configs/Apis';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
    email: '',
    password: '',
    role: 'ROLE_STUDENT',
  });

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');

    try {
      const res = await axios.post(endpoints.register, formData, {
  headers: {
    'Content-Type': 'application/json'
  }
});
      
      if (res.data.message) setMessage(res.data.message);
      else setMessage(res.data);

      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        phoneNum: '',
        email: '',
        password: '',
        role: 'ROLE_STUDENT',
      });

      navigate('/login');
    } catch (error) {
      setErrorMsg(error.response?.data || 'Đăng ký thất bại');
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Họ:</label><br />
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tên:</label><br />
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Số điện thoại:</label><br />
          <input
            name="phoneNum"
            type="tel"
            value={formData.phoneNum}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label><br />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tên đăng nhập:</label><br />
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label><br />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Đăng ký</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
};

export default Register;
