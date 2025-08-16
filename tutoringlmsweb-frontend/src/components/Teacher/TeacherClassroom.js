import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints, authApis } from '../../configs/Apis';
import { Button, Table, Modal, Form, Card, Row, Col } from 'react-bootstrap';

const TeacherClassroom = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    sessions: [], // buổi học trong tuần
    startDate: '', // ngày bắt đầu
    weeks: 4 // số tuần mặc định
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await authApis().get(endpoints.list_classes);
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
        sessions: classRoom.sessions || [],
        startDate: '',
        weeks: 4
      });
    } else {
      setEditingClass(null);
      setFormData({ className: '', sessions: [], startDate: '', weeks: 4 });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAddSession = () => {
    const newSession = { dayOfWeek: 'MONDAY', startTime: '', endTime: '' };
    setFormData({ ...formData, sessions: [...formData.sessions, newSession] });
  };

  const handleRemoveSession = (index) => {
    const newSessions = [...formData.sessions];
    newSessions.splice(index, 1);
    setFormData({ ...formData, sessions: newSessions });
  };

  const handleSessionChange = (index, field, value) => {
    const newSessions = [...formData.sessions];
    newSessions[index][field] = value;

    // Nếu startTime thay đổi, tự động tính endTime = start + 1h30p
    if (field === 'startTime' && value) {
      const [hour, minute] = value.split(':').map(Number);
      let endHour = hour + 1;
      let endMinute = minute + 30;
      if (endMinute >= 60) {
        endHour += 1;
        endMinute -= 60;
      }
      if (endHour >= 24) endHour -= 24;
      newSessions[index].endTime = `${String(endHour).padStart(2,'0')}:${String(endMinute).padStart(2,'0')}`;
    }

    setFormData({ ...formData, sessions: newSessions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await authApis().put(endpoints.edit_class(editingClass.id), formData);
      } else {
        await authApis().post(endpoints.create_class, formData);
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
        await authApis().delete(endpoints.delete_class(id));
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

        <Button className="mb-3" onClick={() => handleOpenModal()}>+ Thêm lớp mới</Button>

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
            {classes.map(cls => (
              <tr key={cls.id}>
                <td>{cls.id}</td>
                <td>{cls.className}</td>
                <td>
                  {cls.sessions?.map((s, i) => (
                    <div key={i}>{s.dayOfWeek} {s.startTime}-{s.endTime}</div>
                  ))}
                </td>
                <td>
                  <Button size="sm" variant="info" onClick={() => navigate(endpoints.class_detail(cls.id))} className="me-2">Xem chi tiết</Button>
                  <Button size="sm" variant="warning" onClick={() => handleOpenModal(cls)} className="me-2">Sửa</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(cls.id)}>Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      {/* Modal Thêm/Sửa lớp */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingClass ? 'Sửa lớp học' : 'Thêm lớp mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên lớp</Form.Label>
              <Form.Control type="text" value={formData.className}
                onChange={e => setFormData({ ...formData, className: e.target.value })} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày bắt đầu</Form.Label>
              <Form.Control type="date" value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số tuần</Form.Label>
              <Form.Control type="number" min="1" value={formData.weeks}
                onChange={e => setFormData({ ...formData, weeks: e.target.value })} required />
            </Form.Group>

            <Card className="p-3 mb-3">
              <Card.Title>🗓 Thời khóa biểu trong tuần</Card.Title>
              {formData.sessions.map((s, idx) => (
                <Row key={idx} className="align-items-center mb-2">
                  <Col md={3}>
                    <Form.Select value={s.dayOfWeek} onChange={e => handleSessionChange(idx, 'dayOfWeek', e.target.value)}>
                      {['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'].map(d => <option key={d} value={d}>{d}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Control type="time" value={s.startTime} onChange={e => handleSessionChange(idx, 'startTime', e.target.value)} required />
                  </Col>
                  <Col md={3}>
                    <Form.Control type="time" value={s.endTime} readOnly />
                  </Col>
                  <Col md={3}>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveSession(idx)}>Xóa</Button>
                  </Col>
                </Row>
              ))}
              <Button variant="success" size="sm" onClick={handleAddSession}>+ Thêm buổi học</Button>
            </Card>

            <Button variant="primary" type="submit">{editingClass ? 'Cập nhật' : 'Tạo mới'}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default TeacherClassroom;
