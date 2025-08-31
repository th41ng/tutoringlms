import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authApis,endpoints} from "../../configs/Apis";
import { Card, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const EssayAssignmentPage = () => {
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // <-- thêm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authApis().get(endpoints.detailEssayAssignment(assignmentId));
        console.log("Assignment JSON:", res.data);
        setAssignment(res.data);

        const subRes = await authApis().get(endpoints.myEssaySubmission(assignmentId));
        console.log("Submission JSON:", subRes.data);

        if (subRes.data) {
          setSubmission(subRes.data);
          setContent(subRes.data.content || "");
        }
      } catch (err) {
        console.error("Error fetching data:", err.response || err);
        setError("Không thể tải thông tin bài tập hoặc bài làm");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

     try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("content", content);
      if (file) formData.append("file", file);

      const res = await authApis().post(endpoints.submitEssay, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmission(res.data);
      setSuccess("Nộp bài thành công!");

      // 🔹 Quay về trang trước sau 1-2 giây (để hiển thị thông báo)
      setTimeout(() => {
        navigate(-1); // quay lại trang trước
      }, 1500);
    } catch (err) {
      console.error(err.response || err);
      setError("Nộp bài thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  if (!assignment) return <p className="text-danger">{error || "Bài tập không tồn tại"}</p>;

  const isPastDeadline = assignment.deadline && new Date() > new Date(assignment.deadline);

  return (
    <Card className="p-4 shadow-sm">
      <Card.Title>{assignment.title}</Card.Title>
      <Card.Text>{assignment.description}</Card.Text>
      <p>
        <strong>Hạn nộp:</strong>{" "}
        {assignment.deadline ? new Date(assignment.deadline).toLocaleString() : "Không có"}
      </p>

      {assignment.fileUrl && (
        <Button
          variant="primary"
          href={assignment.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3"
        >
          Xem tài liệu
        </Button>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {submission && !isPastDeadline ? (
        // Form chỉnh sửa bài đã nộp
        <Form onSubmit={handleSubmit}>
          <h5>Chỉnh sửa bài làm của bạn:</h5>
          <Form.Group className="mb-3" controlId="content">
            <Form.Label>Nội dung bài làm</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="file">
            <Form.Label>Tải lên file (nếu có)</Form.Label>
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Form.Group>

          <Button type="submit" variant="warning" disabled={submitting}>
            {submitting ? "Đang lưu..." : "Cập nhật bài làm"}
          </Button>
        </Form>
      ) : submission ? (
        // Xem bài đã nộp
        <div>
          <h5>Bài làm của bạn:</h5>
          <p>{submission.content || "Chưa có nội dung"}</p>
          {submission.fileUrl && (
            <Button
              variant="primary"
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem file đã nộp
            </Button>
          )}
          {isPastDeadline && <Alert variant="warning" className="mt-3">Đã quá hạn, không thể chỉnh sửa</Alert>}
        </div>
      ) : !isPastDeadline ? (
        // Form nộp mới
        <Form onSubmit={handleSubmit}>
          <h5>Nộp bài mới:</h5>
          <Form.Group className="mb-3" controlId="content">
            <Form.Label>Nội dung bài làm</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="file">
            <Form.Label>Tải lên file (nếu có)</Form.Label>
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Form.Group>

          <Button type="submit" variant="success" disabled={submitting}>
            {submitting ? "Đang nộp..." : "Nộp bài"}
          </Button>
        </Form>
      ) : (
        <Alert variant="warning">Đã quá hạn, không thể nộp hoặc chỉnh sửa</Alert>
      )}
    </Card>
  );
};

export default EssayAssignmentPage;
