import React, { useContext } from 'react';
import { Card, Row, Col, ListGroup } from 'react-bootstrap';
import { MyUserContext } from '../../configs/Context';

const StudentHome = () => {
  const user = useContext(MyUserContext); // ✅ Lấy thông tin người dùng hiện tại

  return (
    <div>
      <h2 className="mb-4">🏫 Trang chủ học sinh</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">📘 Lớp học của bạn</Card.Header>
            <Card.Body>
              <Card.Text><strong>Tên lớp:</strong> </Card.Text>
              <Card.Text><strong>Giáo viên:</strong> </Card.Text>
              <Card.Text><strong>Lịch học:</strong> </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">📄 Trạng thái bài tập</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>✔️ Đã hoàn thành: <strong></strong></ListGroup.Item>
              <ListGroup.Item>🕒 Chưa hoàn thành: <strong></strong></ListGroup.Item>
              <ListGroup.Item>📅 Sắp tới hạn: <strong></strong></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-info text-white">🙋‍♂️ Thông tin cá nhân</Card.Header>
            <Card.Body>
              <Card.Text><strong>Họ tên:</strong> {user?.lastName} {user?.firstName} </Card.Text>
              <Card.Text><strong>Email:</strong> {user?.email}</Card.Text>
              <Card.Text><strong>Số điện thoại:</strong> {user?.phoneNum }</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-warning text-dark">💸 Học phí</Card.Header>
            <Card.Body>
              <p>Trạng thái: <strong></strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentHome;
