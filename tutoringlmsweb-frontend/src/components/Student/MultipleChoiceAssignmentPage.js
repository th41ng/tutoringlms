import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApis , endpoints } from "../../configs/Apis";
import { Card, Button, Form, Alert } from "react-bootstrap";

export default function DoMCPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [score, setScore] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const mcRes = await authApis().get(endpoints.detailMCAssignment(assignmentId));
        setQuestions(mcRes.data.questions || []);
        setDeadline(mcRes.data.deadline || null);

        const myRes = await authApis().get(endpoints.myMCSubmission(assignmentId));
        if (myRes.data) {
          setAlreadySubmitted(true);
          setScore(myRes.data.score ?? null);
          if (myRes.data.answers) setAnswers(myRes.data.answers);
        }
      } catch (err) {
        console.error(err);
        setError("Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [assignmentId]);

  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
       await authApis().post(
        endpoints.submitMC(assignmentId),
        answers,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );
      setSuccess("Nộp bài thành công!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error(err);
      setError("Nộp bài thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const isExpired = deadline && new Date(deadline) < new Date();

  if (loading) return <p>Đang tải...</p>;

  // Đã nộp
  if (alreadySubmitted) {
    return (
      <div className="container mt-4">
        <Alert variant="info">
          <h4>Bạn đã nộp bài</h4>
          {score !== null && <p>Điểm: <b>{score}</b></p>}
        </Alert>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  // Hết hạn
  if (isExpired) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <h4>Đã quá hạn nộp bài</h4>
          <p>Hạn cuối: {deadline ? new Date(deadline).toLocaleString() : "Không có"}</p>
        </Alert>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  // Còn hạn
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Làm bài trắc nghiệm</h2>
      {deadline && <p>Hạn cuối: <b>{new Date(deadline).toLocaleString()}</b></p>}

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <Card className="mb-3" key={q.id}>
            <Card.Header>Câu {index + 1}</Card.Header>
            <Card.Body>
              <Card.Text>{q.questionText}</Card.Text>
              {q.answers.map(a => (
                <Form.Check
                  type="radio"
                  key={a.id}
                  id={`q${q.id}_a${a.id}`}
                  name={`question-${q.id}`}
                  label={a.answerText}
                  checked={answers[q.id] === a.id}
                  onChange={() => handleSelectAnswer(q.id, a.id)}
                />
              ))}
            </Card.Body>
          </Card>
        ))}

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Đang nộp..." : "Nộp bài"}
        </Button>
      </Form>
    </div>
  );
}
