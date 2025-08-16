
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import { authApis, endpoints } from '../../configs/Apis';

const StudentHome = () => {
  const [user, setUser] = useState(null);             // ✅ tự quản lý user
  const [classroom, setClassroom] = useState(null);   // ✅ thông tin lớp học
  const [joinCode, setJoinCode] = useState('');

  // GỌI API để lấy thông tin user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await authApis().get(endpoints.current_user);
        setUser(res.data); // ✅ lưu vào state
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
      }
    };

    getCurrentUser();
  }, []);

  // GỌI API để lấy thông tin lớp học
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await authApis().get(endpoints.student_classroom);
        if (res.data) {
          setClassroom(res.data);
        }
      } catch (err) {
        console.error("Không có lớp học:", err);
      }
    };

    fetchClass();
  }, []);

  // Gửi yêu cầu tham gia lớp
  const handleJoinClass = async () => {
    try {
      await authApis().post(`${endpoints.join_class}?joinCode=${joinCode}`);
      alert("Tham gia lớp thành công!");

      // GỌI lại API để lấy lớp thực sự
      const res = await authApis().get(endpoints.student_classroom);
      setClassroom(res.data);
    } catch (err) {
      console.error(err);
      alert("Mã lớp không hợp lệ hoặc bạn đã tham gia lớp.");
    }
  };

  if (!user) return <p>Đang tải thông tin người dùng...</p>; 

  return (
    <div>
      <h2 className="mb-4">Trang chủ học sinh</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">Lớp học của bạn</Card.Header>
            <Card.Body>
              {!classroom ? (
                <>
                  <Form.Group controlId="joinCode">
                    <Form.Label>Nhập mã lớp học để tham gia</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="VD: 123456"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" className="mt-2" onClick={handleJoinClass}>
                    Tham gia lớp
                  </Button>
                </>
              ) : (
                <>
                  <Card.Text><strong>Tên lớp:</strong> {classroom.className}</Card.Text>
                  <Card.Text><strong>Giáo viên:</strong> {classroom.teacher.fullName}</Card.Text>
                  <Card.Text><strong>Lịch học:</strong> {classroom.schedule}</Card.Text>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">Trạng thái bài tập</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>Đã hoàn thành: <strong>0</strong></ListGroup.Item>
              <ListGroup.Item>Chưa hoàn thành: <strong>0</strong></ListGroup.Item>
              <ListGroup.Item>Sắp tới hạn: <strong>0</strong></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-info text-white">Thông tin cá nhân</Card.Header>
            <Card.Body>
              <Card.Text><strong>Họ tên:</strong> {user.lastName} {user.firstName}</Card.Text>
              <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
              <Card.Text><strong>Số điện thoại:</strong> {user.phoneNum}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-warning text-dark">Học phí</Card.Header>
            <Card.Body>
              <p>Trạng thái: <strong>Chưa có</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHome;

