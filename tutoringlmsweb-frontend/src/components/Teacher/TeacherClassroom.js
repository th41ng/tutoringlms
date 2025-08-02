import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../../configs/Context';
import { authApis } from '../../configs/Apis';
import {
  Button,
  Table,
  Modal,
  Form,
  Card
} from 'react-bootstrap';

const TeacherClassroom = () => {
  const currentUser = useContext(MyUserContext);
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    schedule: ''
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await authApis().get("/teacher/listClasses");
      setClasses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lớp:", err);
    }
  };

  const handleOpenModal = (classRoom = null) => {
    if (classRoom) {
      setEditingClass(classRoom);
      setFormData({
        className: classRoom.className,
        schedule: classRoom.schedule
      });
    } else {
      setEditingClass(null);
      setFormData({ className: '', schedule: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await authApis().put(`/teacher/editClasses/${editingClass.id}`, formData);
      } else {
        await authApis().post('/teacher/createClasses', formData);
      }
      handleCloseModal();
      fetchClasses();
    } catch (err) {
      console.error("Lỗi khi lưu lớp:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lớp học này không?")) {
      try {
        await authApis().delete(`/teacher/deleteClasses/${id}`);
        fetchClasses();
      } catch (err) {
        console.error("Lỗi khi xóa lớp:", err);
      }
    }
  };

  return (
    <Card className="shadow-sm p-4">
      <Card.Body>
        <Card.Title className="mb-4">📚 Giáo viên: Quản lý lớp học</Card.Title>

        <Button className="mb-3" onClick={() => handleOpenModal()}>
          + Thêm lớp mới
        </Button>

        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Tên lớp</th>
              <th>Lịch học</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.id}</td>
                <td>{cls.className}</td>
                <td>{cls.schedule}</td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => navigate(`/teacher/classroom/${cls.id}`)}
                    className="me-2"
                  >
                    Xem
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleOpenModal(cls)}
                    className="me-2"
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(cls.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      {/* Modal thêm/sửa lớp học */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingClass ? 'Sửa lớp học' : 'Thêm lớp mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên lớp</Form.Label>
              <Form.Control
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lịch học</Form.Label>
              <Form.Control
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingClass ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default TeacherClassroom;
