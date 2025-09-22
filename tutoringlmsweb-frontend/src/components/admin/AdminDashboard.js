import React, { useEffect, useState, } from 'react';
import { authApis, endpoints } from '../../configs/Apis';
import { Button, Table, Form, Modal } from 'react-bootstrap';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'ROLE_STUDENT',
    firstName: '',
    lastName: '',
    phoneNum: '',
    password: ''
  });

  const loadUsers = async () => {
    try {
      const response = await authApis().get(endpoints.listUsers);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNum: user.phoneNum || '',
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        role: 'ROLE_STUDENT',
        firstName: '',
        lastName: '',
        phoneNum: '',
        password: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingUser) {
        await authApis().put(endpoints.editUser(editingUser.id), formData);
      } else {
        await authApis().post(endpoints.createUser, formData);
      }
      handleCloseModal();
      loadUsers();
    } catch (error) {
      console.error("Lỗi khi thêm hoặc sửa người dùng:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        await authApis().delete(endpoints.deleteUser(id));
        loadUsers();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    }
  };

  return (
    <div>
      <h2>Quản lý người dùng (Admin Dashboard)</h2>
      <Button onClick={() => handleOpenModal()}>Thêm người dùng mới</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Quyền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.phoneNum}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleOpenModal(user)}>Sửa</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Họ</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={formData.phoneNum}
                onChange={(e) => setFormData({ ...formData, phoneNum: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Mật khẩu (chỉ khi tạo mới hoặc thay đổi)</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quyền</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="ROLE_ADMIN">Quản trị viên</option>
                <option value="ROLE_TEACHER">Giáo viên</option>
                <option value="ROLE_STUDENT">Học sinh</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit">{editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
