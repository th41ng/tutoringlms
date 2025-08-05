// components/assignments/EditEssayModal.js
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const EditEssayModal = ({ show, handleClose, assignment, setAssignment, handleSave }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Sửa bài tập tự luận</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        <Form.Label>Hạn nộp</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={assignment.deadline?.slice(0, 16)}
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
                    <Form.Group className="mb-3">
                        <Form.Label>Câu hỏi</Form.Label>
                        <Form.Control
                            as="textarea"
                            value={assignment.question || ""}
                            onChange={(e) => setAssignment({ ...assignment, question: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Thay file mới</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setAssignment({ ...assignment, file: e.target.files[0] })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="primary" onClick={handleSave}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditEssayModal;
