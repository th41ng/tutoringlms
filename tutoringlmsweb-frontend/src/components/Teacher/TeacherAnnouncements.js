import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Alert, Table } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const TeacherAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchClasses();
        fetchAnnouncements();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await authApis().get(endpoints.list_classes);
            setClasses(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách lớp:", err);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await authApis().get(endpoints.all_announcements);
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Lỗi khi tải thông báo:", err);
        }
    };

    const resetForm = () => {
        setTitle("");
        setContent("");
        setSelectedClassId("");
        setEditingId(null);
        setError("");
    };

    const handleCreate = async () => {
        if (!title || !content || !selectedClassId) {
            setError("Vui lòng nhập đầy đủ tiêu đề, nội dung và chọn lớp.");
            return;
        }

        try {
            await authApis().post(endpoints.create_announcement, {
                title,
                content,
                classRoomId: selectedClassId,
            });
            fetchAnnouncements();
            resetForm();
            setShowModal(false);
        } catch (err) {
            console.error("Tạo thông báo thất bại", err);
            setError("Tạo thông báo thất bại.");
        }
    };

    const handleEdit = (a) => {
        setEditingId(a.id);
        setTitle(a.title);
        setContent(a.content);
        setSelectedClassId(a.classRoom?.id || "");
        setError("");
        setShowModal(true);
    };

    const handleUpdate = async () => {
        if (!title || !content || !selectedClassId) {
            setError("Vui lòng nhập đầy đủ tiêu đề, nội dung và chọn lớp.");
            return;
        }

        try {
            await authApis().put(endpoints.update_announcement(editingId), {
                title,
                content,
                classRoomId: selectedClassId,
            });
            fetchAnnouncements();
            resetForm();
            setShowModal(false);
        } catch (err) {
            console.error("Cập nhật thông báo thất bại", err);
            setError("Cập nhật thông báo thất bại.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xoá thông báo này?")) {
            try {
              await authApis().delete(endpoints.delete_announcement(id));
                fetchAnnouncements();
            } catch (err) {
                console.error("Xóa thông báo thất bại", err);
                setError("Xóa thông báo thất bại.");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>📢 Quản lý Thông báo</h2>

            <Button variant="success" className="mb-3" onClick={() => setShowModal(true)}>
                ➕ Tạo Thông báo
            </Button>

            {announcements.length === 0 ? (
                <p>Chưa có thông báo nào.</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tiêu đề</th>
                            <th>Nội dung</th>
                            <th>Lớp</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map((a, index) => (
                            <tr key={a.id}>
                                <td>{index + 1}</td>
                                <td>{a.title}</td>
                                <td>{a.content}</td>
                                <td>{a.className}</td>
                                <td>{new Date(a.createdAt).toLocaleString()}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(a)}>
                                        ✏️
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>
                                        🗑️
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingId ? "Cập nhật Thông báo" : "Tạo Thông báo"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Lớp học</Form.Label>
                        <Form.Select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                        >
                            <option value="">-- Chọn lớp --</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.className}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tiêu đề"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nội dung</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Nhập nội dung"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                        Đóng
                    </Button>
                    <Button variant={editingId ? "primary" : "success"} onClick={editingId ? handleUpdate : handleCreate}>
                        {editingId ? "💾 Cập nhật" : "➕ Tạo"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TeacherAnnouncements;
