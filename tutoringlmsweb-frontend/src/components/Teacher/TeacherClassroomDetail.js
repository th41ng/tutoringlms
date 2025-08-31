import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Table,
  Form,
  Button,
  Modal,
  Badge,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { authApis,endpoints } from "../../configs/Apis";
import dayjs from "dayjs";

const ClassroomDetail = () => {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Attendance modal
  const [showModal, setShowModal] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    loadClassDetail();
    loadStudents();
  }, [id]);

  const loadClassDetail = async () => {
    try {
      const res = await authApis().get(endpoints.classDetail(id));
      const data = res.data;
      setClassInfo(data);

      if (data.sessions?.length > 0) {
        const minDate = data.sessions.reduce(
          (min, s) => (!min || dayjs(s.date).isBefore(min) ? s.date : min),
          null
        );

        const start = dayjs(minDate);
        const end = start.add(6, "day");

        setStartDate(start.format("YYYY-MM-DD"));
        setEndDate(end.format("YYYY-MM-DD"));
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy thông tin lớp:", err);
      alert("Không thể tải thông tin lớp học");
    }
  };

  const loadStudents = async () => {
    try {
      const res = await authApis().get(endpoints.classStudents(id));
      setStudents(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách học sinh:", err);
      alert("Không thể tải danh sách học sinh");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này khỏi lớp?")) return;
    try {
      await authApis().delete(endpoints.deleteStudent(id, studentId));
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (err) {
      console.error("❌ Lỗi khi xóa học sinh:", err);
      alert("Không thể xóa học sinh");
    }
  };

  const openAttendanceModal = async (session) => {
    setSelectedSession(session);
    try {
      const res = await authApis().get(endpoints.attendanceSession(session.id));
      setAttendanceList(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy dữ liệu điểm danh:", err);
      setAttendanceList([]);
    }
    setShowModal(true);
  };

  const renderScheduleTable = () => {
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
              <th key={d.format("YYYY-MM-DD")}>{d.format("DD/MM/YYYY")}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {days.map((d) => {
              const sessionsInDay =
                classInfo.sessions?.filter(
                  (s) => s.date === d.format("YYYY-MM-DD")
                ) || [];
              return (
                <td key={d.format("YYYY-MM-DD")}>
                  {sessionsInDay.length > 0 ? (
                    sessionsInDay.map((s) => (
                      <Button
                        key={s.id}
                        variant="outline-primary"
                        size="sm"
                        className="d-block mb-2"
                        onClick={() => openAttendanceModal(s)}
                      >
                        {s.startTime} - {s.endTime}
                      </Button>
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

  if (!classInfo)
    return <h4 className="text-center mt-4">⏳ Đang tải thông tin lớp...</h4>;

  return (
    <div className="container mt-4">
      {/* Header */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <h2 className="fw-bold text-primary">📘 {classInfo.className}</h2>
          <p className="mb-0">
            <strong>Mã lớp:</strong>{" "}
            <Badge bg="info" text="dark">
              {classInfo.joinCode}
            </Badge>
          </p>
        </Card.Body>
      </Card>

      {/* Schedule */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold bg-light">📅 Thời khóa biểu</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Từ ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Đến ngày</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {renderScheduleTable()}
        </Card.Body>
      </Card>

      {/* Students */}
      <Card className="shadow-sm">
        <Card.Header className="fw-bold bg-light">👨‍🎓 Danh sách học sinh</Card.Header>
        <Table striped bordered hover responsive className="m-0 text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Tên đăng nhập</th>
              <th>Họ tên</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={s.id}>
                <td>{idx + 1}</td>
                <td>{s.username}</td>
                <td>{s.fullName}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteStudent(s.id)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Attendance Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            📌 Điểm danh ngày {selectedSession?.date} (
            {selectedSession?.startTime} - {selectedSession?.endTime})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {attendanceList.length === 0 ? (
            <p className="text-muted">⚠️ Không có dữ liệu điểm danh</p>
          ) : (
            <Table bordered hover responsive className="text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Trạng thái</th>
                  <th>Ảnh điểm danh</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((a, idx) => (
                  <tr key={a.id}>
                    <td>{idx + 1}</td>
                    <td>{a.studentName}</td>
                    <td>
                      {a.present ? (
                        <Badge bg="success">Có mặt</Badge>
                      ) : (
                        <Badge bg="danger">Vắng</Badge>
                      )}
                    </td>
                    <td>
                      {a.capturedFaceImage ? (
                        <Image src={a.capturedFaceImage} width={60} height={60} rounded />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClassroomDetail;
