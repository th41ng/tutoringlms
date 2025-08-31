import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Table, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";

export default function ViewSubmissions() {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type"); // ESSAY hoặc MULTIPLE_CHOICE

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState("");

  useEffect(() => {
    async function fetchSubmissions() {
      try {
          const res = await authApis().get(endpoints.assignmentSubmissions(assignmentId, type));
        setSubmissions(res.data);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        setError("Không tải được danh sách nộp bài");
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, [assignmentId, type]);

  const openGradeModal = (submission) => {
    setCurrentSubmission(submission);
    setGradeInput(submission.grade ?? "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentSubmission(null);
    setGradeInput("");
  };

  const submitGrade = async () => {
    try {
     await authApis().post(
      endpoints.submitGrade(assignmentId, currentSubmission.studentId),
      { grade: gradeInput }
    );

      setSubmissions(submissions.map(sub =>
        sub.studentId === currentSubmission.studentId ? { ...sub, grade: gradeInput } : sub
      ));
      closeModal();
    } catch (err) {
      console.error("Lỗi khi lưu điểm:", err.response?.data || err.message);
      alert("Lưu điểm thất bại");
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh sách nộp bài ({type})</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>STT</th>
            <th>Học sinh</th>
            <th>Ngày nộp</th>
            <th>Trễ hạn</th>
            <th>Điểm</th>
            {type === "ESSAY" && <th>Bài làm</th>}
            {type === "ESSAY" && <th>Chấm điểm</th>}
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, idx) => {
            const submittedAt = new Date(sub.submittedAt).toLocaleString();
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{sub.studentName}</td>
                <td>{submittedAt}</td>
                <td>{sub.isLate ? "Có" : "Không"}</td>
                <td>{sub.score ?? sub.grade ?? "Chưa chấm"}</td>

                {type === "ESSAY" && (
                  <td>
                    {sub.fileUrl ? (
                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">Tải file</a>
                    ) : (
                      <span>{sub.content || "Không có nội dung"}</span>
                    )}
                  </td>
                )}

                {type === "ESSAY" && (
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openGradeModal(sub)}
                    >
                      Chấm điểm
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Modal chấm điểm */}
      <Modal show={modalOpen} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chấm điểm: {currentSubmission?.studentName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Bài làm:</strong></p>
          {currentSubmission?.fileUrl ? (
            <a href={currentSubmission.fileUrl} target="_blank" rel="noopener noreferrer">Tải file</a>
          ) : (
            <p>{currentSubmission?.content || "Không có nội dung"}</p>
          )}
          <Form.Group className="mt-3">
            <Form.Label>Điểm</Form.Label>
            <Form.Control
              type="number"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              min="0"
              max="10"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Hủy</Button>
          <Button variant="success" onClick={submitGrade}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
