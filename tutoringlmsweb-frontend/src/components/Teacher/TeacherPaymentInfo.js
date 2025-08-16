import React, { useState } from "react";
import { authApis } from "../../configs/Apis";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const TeacherPaymentInfo = () => {
  const [amount] = useState(200000);
  const [bankAccount, setBankAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("bankAccount", bankAccount);
      formData.append("accountName", accountName);
      if (qrCodeFile) formData.append("qrFile", qrCodeFile);

      await authApis().post("/class-payments/create-all", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatusMessage("Cập nhật thông tin ngân hàng thành công cho tất cả lớp!");
    } catch (err) {
      console.error(err);
      setStatusMessage("Cập nhật thất bại. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Thông tin ngân hàng áp dụng cho tất cả lớp</h3>

      {statusMessage && <Alert variant="info">{statusMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Số tiền (200k/lớp)</Form.Label>
          <Form.Control type="number" value={amount} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Số tài khoản</Form.Label>
          <Form.Control
            type="text"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tên chủ tài khoản</Form.Label>
          <Form.Control
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>QR code (nếu có)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setQrCodeFile(e.target.files[0])}
          />
        </Form.Group>

        <Button variant="success" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Lưu thông tin"}
        </Button>
      </Form>
    </div>
  );
};

export default TeacherPaymentInfo;
