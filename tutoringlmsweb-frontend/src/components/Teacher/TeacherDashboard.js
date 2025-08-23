import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Spinner } from 'react-bootstrap';
import { authApis } from '../../configs/Apis';

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await authApis().get("/teacher/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải dữ liệu...</p>
      </Container>
    );
  }

  if (!stats) {
    return (
      <Container className="mt-5 text-center">
        <p className="text-danger">Không thể tải thống kê.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary text-center">Thống kê giáo viên</h2>

      <Row className="g-4 justify-content-center">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">Số học sinh</Card.Title>
              <Card.Text className="fs-2 fw-bold text-dark">
                {stats.totalStudents}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">Số lớp</Card.Title>
              <Card.Text className="fs-2 fw-bold text-dark">
                {stats.totalClasses}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="text-muted">Tổng doanh thu</Card.Title>
              <Card.Text className="fs-5 fw-bold text-primary">
                {stats.totalRevenue?.toLocaleString()} ₫
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;
