import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../configs/Apis';
import { MyUserContext } from '../../configs/Context';

const CreateEssayAssign = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [question, setQuestion] = useState('');
  const [file, setFile] = useState(null);
  const [classRoomId, setClassRoomId] = useState('');
  const [classes, setClasses] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await authApis().get(endpoints.list_classes);
        const data = res.data;

        if (Array.isArray(data)) {
          setClasses(data);
          if (data.length > 0) {
            setClassRoomId(data[0].id.toString());
          }
        } else {
          console.warn("API trả về không phải mảng:", data);
          setClasses([]);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách lớp học:", err);
        setClasses([]);
      }
    };

    fetchClasses();
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !deadline || !question || !classRoomId) {
    setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
    return;
  }

  try {
    const formData = new FormData();

    // 👇 gói toàn bộ data trong key "data" đúng với @RequestPart("data")
    const dto = {
      title,
      description,
      deadline,
      question,
      classRoomId: parseInt(classRoomId)
    };
    formData.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));

    // 👇 file đi riêng đúng với @RequestPart("file")
    if (file) {
      formData.append("file", file);
    }

    await authApis().post(endpoints.create_ESassignment, formData);

    setSuccess(true);
    setError('');
  } catch (err) {
    console.error(err);
    setError('Tạo bài tập thất bại!');
    setSuccess(false);
  }
};

  return (
    <div className="container mt-4">
      <h3>Tạo bài tập tự luận</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Tạo bài tập thành công!</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tiêu đề bài tập"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Ghi chú thêm nếu có"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hạn nộp *</Form.Label>
          <Form.Control
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Câu hỏi / yêu cầu *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Nhập nội dung bài tự luận hoặc ghi 'xem file đính kèm'"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Đính kèm đề bài (PDF, DOCX, ...)</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Chọn lớp học *</Form.Label>
          <Form.Select
            value={classRoomId}
            onChange={(e) => setClassRoomId(e.target.value)}
            required
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.className}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">Tạo bài tập</Button>
      </Form>
    </div>
  );
};

export default CreateEssayAssign;
