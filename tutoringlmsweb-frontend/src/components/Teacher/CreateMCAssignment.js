import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
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

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await authApis().get(endpoints.list_classes);
        setClasses(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách lớp:", err);
      }
    };
    fetchClasses();
  }, []);

  const handleAddQuestion = () => {
    setAssignment((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: "", answers: [{ answerText: "", isCorrect: false }] },
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
      if (q.answers.filter((a) => a.isCorrect).length === 0) {
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
      <h2 className="mb-4">📘 Tạo bài tập trắc nghiệm</h2>

      {/* Thông tin bài tập */}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            value={assignment.title}
            onChange={(e) =>
              setAssignment({ ...assignment, title: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            value={assignment.description}
            onChange={(e) =>
              setAssignment({ ...assignment, description: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Hạn nộp</Form.Label>
          <Form.Control
            type="datetime-local"
            value={assignment.deadline}
            onChange={(e) =>
              setAssignment({ ...assignment, deadline: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label>Lớp học</Form.Label>
          <Form.Select
            value={assignment.classRoomId}
            onChange={(e) =>
              setAssignment({ ...assignment, classRoomId: e.target.value })
            }
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>

      {/* Bảng câu hỏi */}
      <h4 className="mb-3">Danh sách câu hỏi</h4>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Câu hỏi</th>
            <th style={{ width: "60%" }}>Đáp án</th>
            <th style={{ width: "10%" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {assignment.questions.map((q, qIndex) => (
            <tr key={qIndex}>
              <td>
                <Form.Control
                  type="text"
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, e.target.value)
                  }
                  placeholder={`Câu hỏi ${qIndex + 1}`}
                />
              </td>
              <td>
                {q.answers.map((a, aIndex) => (
                  <div
                    key={aIndex}
                    className="d-flex align-items-center mb-2"
                  >
                    <Form.Check
                      type="checkbox"
                      checked={a.isCorrect}
                      onChange={() => handleToggleCorrect(qIndex, aIndex)}
                      className="me-2"
                    />
                    <Form.Control
                      type="text"
                      value={a.answerText}
                      onChange={(e) =>
                        handleAnswerChange(qIndex, aIndex, e.target.value)
                      }
                      placeholder={`Đáp án ${aIndex + 1}`}
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                      disabled={q.answers.length <= 1}
                    >
                      X
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => handleAddAnswer(qIndex)}
                  disabled={q.answers.length >= 10}
                >
                  + Thêm đáp án
                </Button>
              </td>
              <td className="text-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveQuestion(qIndex)}
                >
                  Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" className="mb-3" onClick={handleAddQuestion}>
        + Thêm câu hỏi
      </Button>

      <div className="mt-3">
        <Button variant="success" onClick={handleSubmit}>
          ✅ Gửi bài tập
        </Button>
      </div>
    </div>
  );
};

export default CreateMCAssignment;
