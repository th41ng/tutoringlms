// components/assignments/EditEssayModal.js
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EditEssayModal = ({ show, handleClose, assignment, setAssignment, handleSave }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>✏️ Sửa bài tập tự luận</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Tiêu đề</Form.Label>
                        <Form.Control
                            type="text"
                            required
                            size="sm"
                            value={assignment.title || ""}
                            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hạn nộp</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            required
                            size="sm"
                            value={assignment.deadline ? assignment.deadline.slice(0, 16) : ""}
                            onChange={(e) => setAssignment({ ...assignment, deadline: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            size="sm"
                            value={assignment.description || ""}
                            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Câu hỏi</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            size="sm"
                            value={assignment.question || ""}
                            onChange={(e) => setAssignment({ ...assignment, question: e.target.value })}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Thay file mới</Form.Label>
                        <Form.Control
                            type="file"
                            size="sm"
                            onChange={(e) => setAssignment({ ...assignment, file: e.target.files[0] })}
                        />
                        {assignment.fileUrl && (
                            <Form.Text className="text-muted">
                                File hiện tại:{" "}
                                <a href={assignment.fileUrl} target="_blank" rel="noreferrer">
                                    Xem file
                                </a>
                            </Form.Text>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" size="sm" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                    💾 Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditEssayModal;
