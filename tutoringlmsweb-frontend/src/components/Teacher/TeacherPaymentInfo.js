import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApis } from "../../configs/Apis";
import { Form, Button, Alert, Spinner, Card, Row, Col } from "react-bootstrap";

const TeacherPaymentInfo = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(200000);
  const [bankAccount, setBankAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [currentInfo, setCurrentInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load thông tin hiện tại
  useEffect(() => {
    const fetchCurrentInfo = async () => {
      try {
        const res = await authApis().get("/class-payments/current");
        setCurrentInfo(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải thông tin hiện tại:", err);
      }
    };
    fetchCurrentInfo();
  }, []);

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

      setStatusMessage("✅ Cập nhật thông tin ngân hàng thành công cho tất cả lớp!");
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Cập nhật thất bại. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <Row>
        {/* Thông tin hiện tại */}
        {currentInfo && (
          <Col md={12} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="m-0">💳 Thông tin hiện tại</h5>
              </Card.Header>
              <Card.Body>
                <p><b>Số tiền học phí:</b> {currentInfo.amount?.toLocaleString()} VNĐ</p>
                <p><b>Số tài khoản:</b> {currentInfo.bankAccount}</p>
                <p><b>Chủ tài khoản:</b> {currentInfo.accountName}</p>
                {currentInfo.qrCodeUrl && (
                  <div>
                    <b>QR Code:</b>
                    <div className="mt-2">
                      <img
                        src={currentInfo.qrCodeUrl}
                        alt="QR Code"
                        style={{ maxWidth: "200px", border: "1px solid #ddd" }}
                      />
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Form cập nhật */}
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="m-0">✏️ Cập nhật thông tin ngân hàng</h5>
            </Card.Header>
            <Card.Body>
              {statusMessage && <Alert variant="info">{statusMessage}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Số tiền học phí (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
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

                <div className="d-flex justify-content-between">
                  <Button variant="success" type="submit" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Lưu thông tin"}
                  </Button>

                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => navigate("/classroom-payment")}
                  >
                    Xem danh sách học phí
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherPaymentInfo;
