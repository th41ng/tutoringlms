import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Badge, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EditEssayModal from "./EditEssayModal";

const TeacherAssignments = () => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const navigate = useNavigate();

  const handleEditClick = (assignment) => {
    setSelectedAssignment({ ...assignment });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      const dto = {
        title: selectedAssignment.title,
        deadline: selectedAssignment.deadline,
        description: selectedAssignment.description,
        question: selectedAssignment.question,
        classRoomId: selectedAssignment.classRoom?.id,
      };
      formData.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));

      if (selectedAssignment.file instanceof File) {
        formData.append("file", selectedAssignment.file);
      }

      await authApis().put(endpoints.updateAssignment(selectedAssignment.id), formData);
      setShowEditModal(false);
      fetchAssignments();
    } catch (err) {
      console.error("Lỗi khi cập nhật bài tập:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await authApis().get(endpoints.listAssignments);
      setAssignments(response.data);
    } catch (err) {
      console.error("Lỗi tải danh sách bài tập:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await authApis().get(endpoints.listClasses);
      setClasses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lớp:", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchClasses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài tập này?")) {
      try {
        await authApis().delete(endpoints.deleteAssignment(id));
        fetchAssignments();
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📘 Quản lý bài tập</h2>

      <div className="mb-3 d-flex gap-2">
        <Button variant="primary" onClick={() => navigate("/create-essay-assignment")}>
          ➕ Tạo bài tập tự luận
        </Button>
        <Button variant="success" onClick={() => navigate("/create-mc-assignment")}>
          ➕ Tạo bài tập trắc nghiệm
        </Button>
      </div>

      <Table striped bordered hover responsive className="shadow-sm align-middle">
        <thead className="table-light">
          <tr>
            <th>Tiêu đề</th>
            <th>Lớp</th>
            <th>Hạn nộp</th>
            <th>Loại</th>
            <th>File</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.className || "Không rõ"}</td>
              <td>{a.deadline ? a.deadline.slice(0, 16).replace("T", " ") : "Chưa đặt"}</td>
              <td>
                <Badge bg={a.type === "ESSAY" ? "primary" : "success"}>
                  {a.type === "ESSAY" ? "Tự luận" : "Trắc nghiệm"}
                </Badge>
              </td>
              <td>
                {a.fileUrl ? (
                  <a href={a.fileUrl} target="_blank" rel="noreferrer">
                    📂 Xem file
                  </a>
                ) : (
                  "Không có"
                )}
              </td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  {/* <Button
                    variant="warning"
                    size="sm"
                    onClick={() => {
                      if (a.type === "ESSAY") handleEditClick(a);
                      else navigate(`/edit-mc-assignment/${a.id}`);
                    }}
                  >
                    ✏️ Sửa
                  </Button> */}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>
                    🗑️ Xóa
                  </Button>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => navigate(`/view-submissions/${a.id}?type=${a.type}`)}
                  >
                    📊 Xem điểm
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal edit cho ESSAY */}
      {selectedAssignment?.type === "ESSAY" && (
        <EditEssayModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          assignment={selectedAssignment}
          setAssignment={setSelectedAssignment}
          handleSave={handleSaveEdit}
          classes={classes}
        />
      )}
    </div>
  );
};

export default TeacherAssignments;
