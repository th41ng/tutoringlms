import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Spinner, Alert } from "react-bootstrap";

const FaceAttendance = () => {
  const videoRef = useRef(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => (videoRef.current.srcObject = stream))
      .catch((err) => console.error(err));

    fetchCurrentSession();
    const interval = setInterval(fetchCurrentSession, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentSession = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/attendance/currentSession");
      if (res.data.sessionId) {
        setCurrentSession(res.data);
      } else {
        setCurrentSession(null);
      }
    } catch (err) {
      console.error(err);
      setCurrentSession(null);
    }
  };

  const handleCheckIn = async () => {
    if (!currentSession) {
      setMessage("⚠️ Không có lớp học hiện tại.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL("image/jpeg");

      const res = await axios.post("http://localhost:5000/recognize", { image: imgData });
      const { name, confidence, imageUrl } = res.data;

      if (name && confidence > 0.5) {
        await axios.post("http://localhost:8080/api/attendance/record", {
          username: name,
          imageUrl,
          confidence,
        });
        setMessage(`✅ Điểm danh thành công! Xác suất: ${(confidence * 100).toFixed(2)}%`);
      } else {
        setMessage("❌ Không nhận diện được khuôn mặt. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi khi điểm danh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3">
      <h3>Điểm danh tự động</h3>
      <p>
        <b>Lớp hiện tại:</b> {currentSession?.className || "Không có lớp học"}
      </p>
      <video ref={videoRef} autoPlay style={{ width: 400 }}></video>

      <div className="mt-3">
        <Button onClick={handleCheckIn} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Điểm danh"}
        </Button>
      </div>

      {message && <Alert className="mt-2">{message}</Alert>}
    </Card>
  );
};

export default FaceAttendance;