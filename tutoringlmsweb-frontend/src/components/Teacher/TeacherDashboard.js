import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container } from 'react-bootstrap';
import { authApis } from '../../configs/Apis';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalRevenueMonthly: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 🧪 Thay bằng gọi API thực tế
      const fakeStats = {
        totalStudents: 85,
        totalClasses: 6,
        totalRevenueMonthly: 15000000,
      };
      setStats(fakeStats);
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary text-center">📊 Thống kê giáo viên</h2>

      <Row className="g-4 justify-content-center">
        <Col md={4}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">👨‍🎓 Số học sinh</Card.Title>
              <Card.Text className="fs-2 fw-bold text-dark">{stats.totalStudents}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">🏫 Số lớp</Card.Title>
              <Card.Text className="fs-2 fw-bold text-dark">{stats.totalClasses}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">💰 Doanh thu tháng</Card.Title>
              <Card.Text className="fs-4 fw-bold text-success">
                {stats.totalRevenueMonthly.toLocaleString()} ₫
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
