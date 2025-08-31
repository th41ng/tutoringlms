// components/assignments/EditMCAssignment.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Form, Row, Col } from "react-bootstrap";

const EditMCAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const res = await authApis().get(endpoints.detailMCAssignment(id));

        // Nếu chưa có câu hỏi thì khởi tạo 1 mẫu
        if (!res.data.questions || res.data.questions.length === 0) {
          res.data.questions = [
            {
              questionText: "",
              answers: [{ answerText: "", isCorrect: true }],
            },
          ];
        }
        setAssignment(res.data);
      } catch (err) {
        console.error("Lỗi tải bài tập:", err);
      }
    };
    loadAssignment();
  }, [id]);

  const handleSave = async () => {
    try {
      if (!assignment.title || !assignment.deadline) {
        alert("Vui lòng nhập tiêu đề và hạn nộp!");
        return;
      }

      for (let q of assignment.questions) {
        const corrects = q.answers.filter((a) => a.isCorrect);
        if (corrects.length === 0) {
          alert("Mỗi câu hỏi cần ít nhất 1 đáp án đúng.");
          return;
        }
      }

      // PUT dữ liệu (giữ nguyên logic cũ)
      await authApis().put(endpoints.updateMCAssignment(id), assignment);

      alert("Đã lưu thành công!");
      navigate("/teacher-assignments");
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    }
  };

  const updateQuestionText = (index, text) => {
    const updated = { ...assignment };
    updated.questions[index].questionText = text;
    setAssignment(updated);
  };

  const updateAnswer = (qIndex, aIndex, field, value) => {
    const updated = { ...assignment };
    updated.questions[qIndex].answers[aIndex][field] = value;
    setAssignment(updated);
  };

  const addAnswer = (qIndex) => {
    const updated = { ...assignment };
    if (updated.questions[qIndex].answers.length >= 10) return;
    updated.questions[qIndex].answers.push({ answerText: "", isCorrect: false });
    setAssignment(updated);
  };

  const removeAnswer = (qIndex, aIndex) => {
    const updated = { ...assignment };
    if (updated.questions[qIndex].answers.length <= 1) return;
    updated.questions[qIndex].answers.splice(aIndex, 1);
    setAssignment(updated);
  };

  const addQuestion = () => {
    const updated = { ...assignment };
    updated.questions.push({
      questionText: "",
      answers: [{ answerText: "", isCorrect: true }],
    });
    setAssignment(updated);
  };

  const removeQuestion = (index) => {
    const updated = { ...assignment };
    if (updated.questions.length <= 1) return;
    updated.questions.splice(index, 1);
    setAssignment(updated);
  };

  if (!assignment) return <p>Đang tải...</p>;

  return (
    <div className="container mt-4">
      <h3>Sửa bài tập trắc nghiệm</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            value={assignment.title}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hạn nộp</Form.Label>
          <Form.Control
            type="datetime-local"
            value={assignment.deadline ? assignment.deadline.slice(0, 16) : ""}
            onChange={(e) => setAssignment({ ...assignment, deadline: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            value={assignment.description || ""}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          />
        </Form.Group>

        {assignment.questions.map((q, qIndex) => (
          <div key={qIndex} className="border rounded p-3 mb-3">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Câu hỏi {qIndex + 1}</Form.Label>
                  <Form.Control
                    value={q.questionText}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs="auto" className="d-flex align-items-end">
                <Button variant="outline-danger" onClick={() => removeQuestion(qIndex)}>
                  Xoá câu hỏi
                </Button>
              </Col>
            </Row>
            <hr />
            {q.answers.map((a, aIndex) => (
              <Row key={aIndex} className="mb-2 align-items-center">
                <Col md={7}>
                  <Form.Control
                    value={a.answerText}
                    placeholder={`Đáp án ${aIndex + 1}`}
                    onChange={(e) => updateAnswer(qIndex, aIndex, "answerText", e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Check
                    type="checkbox"
                    label="Đúng"
                    checked={a.isCorrect}
                    onChange={(e) => updateAnswer(qIndex, aIndex, "isCorrect", e.target.checked)}
                  />
                </Col>
                <Col md={2}>
                  <Button
                    variant="outline-danger"
                    onClick={() => removeAnswer(qIndex, aIndex)}
                  >
                    Xoá
                  </Button>
                </Col>
              </Row>
            ))}
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => addAnswer(qIndex)}
              disabled={q.answers.length >= 10}
            >
              + Thêm đáp án
            </Button>
          </div>
        ))}

        <div className="text-end">
          <Button variant="outline-success" onClick={addQuestion}>
            + Thêm câu hỏi
          </Button>
        </div>
      </Form>

      <div className="mt-4 d-flex gap-2">
        <Button variant="secondary" onClick={() => navigate("/teacher-assignments")}>
          Quay lại
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default EditMCAssignment;
