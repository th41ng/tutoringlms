import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Button, Card, Spinner, Alert, Form } from "react-bootstrap";

// ✅ import API helper
import { authApis, endpoints } from "../configs/Apis";

const FaceEnroll = () => {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Lấy thông tin user hiện tại
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await authApis().get(endpoints.current_user);
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin người dùng:", err);
      }
    };

    getCurrentUser();
  }, []);

  const capturePhoto = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setPhotos((prev) => [...prev, imageSrc]);
  };

  // ✅ xử lý khi chọn ảnh upload
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = [];
    for (let file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result]); // base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      setMessage("⚠️ Không lấy được thông tin người dùng.");
      return;
    }
    if (photos.length < 3) {
      setMessage("⚠️ Cần ít nhất 3 ảnh để đăng ký khuôn mặt.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await authApis().post("http://localhost:5000/enroll", {
        username: user.username,
        images: photos,
      });

      setMessage("✅ Đăng ký khuôn mặt thành công!");
      setPhotos([]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi đăng ký khuôn mặt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3">
      <h3>Đăng ký khuôn mặt</h3>
      <p>
        Người dùng: <b>{user?.fullName || user?.username || "Đang tải..."}</b>
      </p>

      {/* Camera */}
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        videoConstraints={{ facingMode: "user" }}
        audio={false}
        style={{ borderRadius: 8, border: "2px solid #ccc" }}
      />

      <div className="mt-3">
        <Button onClick={capturePhoto} className="me-2">
          Chụp ảnh
        </Button>

        {/* ✅ nút chọn file */}
        <Form.Control
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="d-inline-block w-auto me-2"
        />

        <Button onClick={handleEnroll} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Đăng ký"}
        </Button>
      </div>

      <p className="mt-2">Đã có {photos.length} ảnh</p>

      {/* ✅ hiển thị preview ảnh */}
      <div className="d-flex flex-wrap gap-2 mt-2">
        {photos.map((p, i) => (
          <img
            key={i}
            src={p}
            alt={`photo-${i}`}
            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
          />
        ))}
      </div>

      {message && <Alert className="mt-2">{message}</Alert>}
    </Card>
  );
};

export default FaceEnroll;