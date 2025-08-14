import React, { useEffect, useState } from "react";
import { authApis } from "../../configs/Apis";
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AssignmentsList = () => {
  const [assignments, setAssignments] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy lớp học hiện tại của học sinh
        const classRes = await authApis().get("/student/classroom");
        if (!classRes.data) {
          setError("Bạn chưa tham gia lớp nào.");
          return;
        }
        setClassroom(classRes.data);

        // Lấy danh sách bài tập theo lớp
        const assignRes = await authApis().get(`/submission/class/${classRes.data.id}`);
        setAssignments(Array.isArray(assignRes.data) ? assignRes.data : []);
      } catch (err) {
        console.error(err.response || err);
        setError("Không thể tải danh sách bài tập");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <p className="text-danger">{error}</p>;
  if (assignments.length === 0) return <p>Chưa có bài tập nào.</p>;

  return (
    <Row className="g-4">
      {assignments.map((assignment, index) => (
        <Col md={6} lg={4} key={`${assignment.id}-${index}`}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>{assignment.title}</Card.Title>
              <Card.Text>{assignment.description}</Card.Text>
              <p>
                <strong>Hạn nộp:</strong>{" "}
                {assignment.deadline
                  ? new Date(assignment.deadline).toLocaleString()
                  : "Không có"}
              </p>

              {assignment.fileUrl && (
                <Button
                  variant="primary"
                  href={assignment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2"
                >
                  Xem tài liệu
                </Button>
              )}

              <div className="mt-2">
                {assignment.type === "ESSAY" ? (
                  <Button
                    variant="success"
                    onClick={() => navigate(`/student/essay/${assignment.id}`)}
                  >
                    Làm bài tự luận
                  </Button>
                ) : (
                  <Button
                    variant="info"
                    onClick={() => navigate(`/student/mc/${assignment.id}`)}
                  >
                    Làm bài trắc nghiệm
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AssignmentsList;
