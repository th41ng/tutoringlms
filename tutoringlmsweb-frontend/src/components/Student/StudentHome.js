import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button, Modal, Table, Badge } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import dayjs from "dayjs";
import { FaChalkboardTeacher, FaUserGraduate, FaMoneyBillWave } from "react-icons/fa";

const StudentHome = () => {
  const [user, setUser] = useState(null);
  const [classroom, setClassroom] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await authApis().get(endpoints.currentUser);
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await authApis().get(endpoints.studentClassroom);
        if (res.data) {
          setClassroom(res.data);

          if (res.data.sessions?.length > 0) {
            const dates = res.data.sessions.map((s) => new Date(s.date).getTime());
            const start = new Date(Math.min(...dates));
            const end = new Date(Math.max(...dates));
            setStartDate(dayjs(start).format("YYYY-MM-DD"));
            setEndDate(dayjs(end).format("YYYY-MM-DD"));
          }

          try {
            const payRes = await authApis().get(endpoints.studentCurrentPayment(res.data.id));
            setPaymentStatus(payRes.data?.status || "CHƯA NỘP");
            setPaymentAmount(payRes.data?.amount || 0);
          } catch (err) {
            setPaymentStatus("CHƯA NỘP");
            setPaymentAmount(0);
          } finally {
            setLoadingPayment(false);
          }
        }
      } catch (err) {
        console.error("Không có lớp học:", err);
      }
    };
    fetchClass();
  }, []);

  const handleJoinClass = async () => {
    try {
      await authApis().post(endpoints.joinClass, null, { params: { joinCode } });
      alert("Tham gia lớp thành công!");
      const res = await authApis().get(endpoints.studentClassroom);
      setClassroom(res.data);
    } catch (err) {
      alert("Mã lớp không hợp lệ hoặc bạn đã tham gia lớp.");
    }
  };

  const renderScheduleTable = () => {
    if (!classroom?.sessions || classroom.sessions.length === 0)
      return <p>Chưa có thời khóa biểu.</p>;
    if (!startDate || !endDate) return null;

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const days = [];
    for (let d = start; d.isBefore(end.add(1, "day")); d = d.add(1, "day")) {
      days.push(d);
    }

    return (
      <Table bordered hover responsive className="text-center align-middle">
        <thead className="table-light">
          <tr>
            {days.map((d) => (
              <th key={d.format("YYYY-MM-DD")}>{d.format("DD/MM")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {days.map((d) => {
              const sessionsInDay = classroom.sessions.filter((s) =>
                dayjs(s.date).isSame(d, "day")
              );
              return (
                <td key={d.format("YYYY-MM-DD")}>
                  {sessionsInDay.length > 0 ? (
                    sessionsInDay.map((s) => (
                      <div key={s.id}>
                        <Badge bg="primary">
                          {s.startTime} - {s.endTime}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </Table>
    );
  };

  if (!user) return <p>Đang tải thông tin người dùng...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Trang chủ học sinh</h2>

      <Row className="g-4">
        {/* Thông tin lớp */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex align-items-center">
              <FaChalkboardTeacher className="me-2" /> Lớp học của bạn
            </Card.Header>
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
                  <Button variant="success" className="mt-2" onClick={handleJoinClass}>
                    Tham gia lớp
                  </Button>
                </>
              ) : (
                <>
                  <Card.Text>
                    <strong>Tên lớp:</strong> {classroom.className}
                  </Card.Text>
                  <Card.Text>
                    <strong>Giáo viên:</strong> {classroom.teacher.fullName}
                  </Card.Text>
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    📅 Xem Thời khóa biểu
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Thông tin cá nhân */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white d-flex align-items-center">
              <FaUserGraduate className="me-2" /> Thông tin cá nhân
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Họ tên:</strong> {user.lastName} {user.firstName}
              </Card.Text>
              <Card.Text>
                <strong>Email:</strong> {user.email}
              </Card.Text>
              <Card.Text>
                <strong>Số điện thoại:</strong> {user.phoneNum}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Học phí */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-warning text-dark d-flex align-items-center">
              <FaMoneyBillWave className="me-2" /> Học phí
            </Card.Header>
            <Card.Body>
              {loadingPayment ? (
                <p>Đang tải...</p>
              ) : (
                <p>
                  Trạng thái:{" "}
                  <strong
                    className={
                      paymentStatus === "PAID"
                        ? "text-success"
                        : paymentStatus === "PENDING"
                        ? "text-warning"
                        : "text-danger"
                    }
                  >
                    {paymentStatus}
                  </strong>
                  {paymentAmount ? ` | Số tiền đã nộp: ${paymentAmount} VND` : ""}
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal thời khóa biểu */}
      <Modal
        show={showScheduleModal}
        onHide={() => setShowScheduleModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📅 Thời khóa biểu</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderScheduleTable()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentHome;
