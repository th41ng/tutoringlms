// TeacherClassroom.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints, authApis } from '../../configs/Apis';
import { Button, Table, Modal, Form, Card, Row, Col, Badge } from 'react-bootstrap';
import { PencilSquare, Trash, InfoCircle } from 'react-bootstrap-icons';

const TeacherClassroom = () => {
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    className: '',
    sessions: [],
    startDate: '',
    weeks: 4
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

    if (field === 'startTime' && value) {
      const [hour, minute] = value.split(':').map(Number);
      let endHour = hour + 1;
      let endMinute = minute + 30;
      if (endMinute >= 60) {
        endHour += 1;
        endMinute -= 60;
      }
      if (endHour >= 24) endHour -= 24;
      newSessions[index].endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
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
    <div className="container mt-4">
      <Card className="shadow">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">📘 Quản lý lớp học</h4>
            <Button onClick={() => handleOpenModal()} variant="primary">+ Thêm lớp</Button>
          </div>

          <Table hover bordered responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-center">ID</th>
                <th>Tên lớp</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted">Chưa có lớp nào.</td>
                </tr>
              ) : (
                classes.map(cls => (
                  <tr key={cls.id}>
                    <td className="text-center"><Badge bg="secondary">{cls.id}</Badge></td>
                    <td><strong>{cls.className}</strong></td>
                    <td className="text-center">
                      <Button size="sm" variant="info" onClick={() => navigate(endpoints.class_detail(cls.id))} className="me-2">
                        <InfoCircle className="me-1" /> Chi tiết
                      </Button>
                      <Button size="sm" variant="warning" onClick={() => handleOpenModal(cls)} className="me-2">
                        <PencilSquare className="me-1" /> Sửa
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(cls.id)}>
                        <Trash className="me-1" /> Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingClass ? "✏️ Sửa lớp học" : "➕ Thêm lớp mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên lớp</Form.Label>
              <Form.Control
                type="text"
                value={formData.className}
                onChange={e => setFormData({ ...formData, className: e.target.value })}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Ngày bắt đầu</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>Số tuần</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.weeks}
                  onChange={e => setFormData({ ...formData, weeks: e.target.value })}
                  required
                />
              </Col>
            </Row>

            <Card className="p-3 mb-3 border-0 shadow-sm">
              <Card.Title className="mb-3">🗓️ Thời khóa biểu</Card.Title>
              {formData.sessions.map((s, idx) => (
                <Row key={idx} className="align-items-center mb-2">
                  <Col md={3}>
                    <Form.Select value={s.dayOfWeek} onChange={e => handleSessionChange(idx, 'dayOfWeek', e.target.value)}>
                      {['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
                        .map(d => <option key={d} value={d}>{d}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Control type="time" value={s.startTime} onChange={e => handleSessionChange(idx, 'startTime', e.target.value)} required />
                  </Col>
                  <Col md={3}>
                    <Form.Control type="time" value={s.endTime} readOnly />
                  </Col>
                  <Col md={3} className="text-center">
                    <Button variant="outline-danger" size="sm" onClick={() => handleRemoveSession(idx)}>Xóa</Button>
                  </Col>
                </Row>
              ))}
              <Button variant="outline-success" size="sm" onClick={handleAddSession}>+ Thêm buổi học</Button>
            </Card>

            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>Hủy</Button>
              <Button variant="primary" type="submit">{editingClass ? "Lưu thay đổi" : "Tạo mới"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeacherClassroom;
