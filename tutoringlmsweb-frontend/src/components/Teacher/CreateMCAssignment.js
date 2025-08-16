import React, { useState, useEffect } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";

const CreateMCAssignment = () => {
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
    classRoomId: "",
    questions: [],
  });

  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await authApis().get(endpoints.list_classes);
      setClasses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lớp:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddQuestion = () => {
    setAssignment((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          answers: [{ answerText: "", isCorrect: false }],
        },
      ],
    }));
  };

  const handleAddAnswer = (qIndex) => {
    const updated = [...assignment.questions];
    if (updated[qIndex].answers.length >= 10) return;
    updated[qIndex].answers.push({ answerText: "", isCorrect: false });
    setAssignment({ ...assignment, questions: updated });
  };

  const handleQuestionChange = (qIndex, value) => {
    const updated = [...assignment.questions];
    updated[qIndex].questionText = value;
    setAssignment({ ...assignment, questions: updated });
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updated = [...assignment.questions];
    updated[qIndex].answers[aIndex].answerText = value;
    setAssignment({ ...assignment, questions: updated });
  };

  const handleToggleCorrect = (qIndex, aIndex) => {
    const updated = [...assignment.questions];
    updated[qIndex].answers[aIndex].isCorrect =
      !updated[qIndex].answers[aIndex].isCorrect;
    setAssignment({ ...assignment, questions: updated });
  };

  const handleRemoveAnswer = (qIndex, aIndex) => {
    const updated = [...assignment.questions];
    updated[qIndex].answers.splice(aIndex, 1);
    setAssignment({ ...assignment, questions: updated });
  };

  const handleRemoveQuestion = (qIndex) => {
    const updated = [...assignment.questions];
    updated.splice(qIndex, 1);
    setAssignment({ ...assignment, questions: updated });
  };

  const validateAssignment = () => {
    for (let i = 0; i < assignment.questions.length; i++) {
      const q = assignment.questions[i];
      if (!q.questionText.trim()) {
        alert(`Câu hỏi ${i + 1} bị bỏ trống.`);
        return false;
      }
      if (q.answers.length === 0) {
        alert(`Câu hỏi ${i + 1} không có đáp án.`);
        return false;
      }
      const correctCount = q.answers.filter((a) => a.isCorrect).length;
      if (correctCount === 0) {
        alert(`Câu hỏi ${i + 1} phải có ít nhất 1 đáp án đúng.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAssignment()) return;

    try {
      await authApis().post(endpoints.create_MCassignment, assignment);
      alert("Tạo bài trắc nghiệm thành công!");
      navigate("/teacher/assignments");
    } catch (err) {
      console.error("Lỗi khi tạo bài trắc nghiệm:", err);
      alert("Đã xảy ra lỗi!");  
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tạo bài tập trắc nghiệm</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            value={assignment.title}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            value={assignment.description}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Hạn nộp</Form.Label>
          <Form.Control
            type="datetime-local"
            value={assignment.deadline}
            onChange={(e) => setAssignment({ ...assignment, deadline: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Lớp học</Form.Label>
          <Form.Select
            value={assignment.classRoomId}
            onChange={(e) => setAssignment({ ...assignment, classRoomId: e.target.value })}
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="mb-3">
          <h4>Câu hỏi</h4>
          {assignment.questions.map((q, qIndex) => (
            <Card key={qIndex} className="mb-3 p-3">
              <Form.Group className="mb-2">
                <Form.Label>Câu {qIndex + 1}</Form.Label>
                <Form.Control
                  type="text"
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
              </Form.Group>
              <div className="ms-3">
                {q.answers.map((a, aIndex) => (
                  <div key={aIndex} className="d-flex align-items-center mb-2">
                    <Form.Check
                      type="checkbox"
                      checked={a.isCorrect}
                      onChange={() => handleToggleCorrect(qIndex, aIndex)}
                      className="me-2"
                      label=""
                    />
                    <Form.Control
                      type="text"
                      value={a.answerText}
                      onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                      placeholder={`Đáp án ${aIndex + 1}`}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                      disabled={q.answers.length <= 1}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
              <div className="d-flex gap-2 mt-2">
                <Button
                  variant="secondary"
                  onClick={() => handleAddAnswer(qIndex)}
                  disabled={q.answers.length >= 10}
                >
                  + Thêm đáp án
                </Button>
                <Button variant="outline-danger" onClick={() => handleRemoveQuestion(qIndex)}>
                  Xoá câu hỏi
                </Button>
              </div>
            </Card>
          ))}

          <Button variant="primary" onClick={handleAddQuestion}>
            + Thêm câu hỏi
          </Button>
        </div>

        <Button variant="success" onClick={handleSubmit}>
          Gửi bài tập
        </Button>
      </Form>
    </div>
  );
};

export default CreateMCAssignment;
