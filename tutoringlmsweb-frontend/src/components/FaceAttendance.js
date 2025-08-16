import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Button, Card, Spinner } from "react-bootstrap";

const FaceAttendance = () => {
  const videoRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [faceEnrolled, setFaceEnrolled] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => videoRef.current.srcObject = stream)
      .catch(err => console.error(err));

    fetchCurrentSession();
    const interval = setInterval(fetchCurrentSession, 60000); // update mỗi 1 phút
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

  const capturePhoto = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setPhotos([...photos, canvas.toDataURL("image/jpeg")]);
  };

  const submitEnroll = async () => {
    const username = prompt("Nhập username để đăng ký khuôn mặt:");
    if (!username) return alert("Cần nhập username để đăng ký.");

    if (photos.length < 3) {
      alert("Cần ít nhất 3 ảnh để đăng ký khuôn mặt.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/enroll", { username, images: photos });
      setFaceEnrolled(true);
      alert("Đăng ký khuôn mặt thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi đăng ký khuôn mặt");
    } finally {
      setLoading(false);
    }
  };

  const submitCheckIn = async () => {
    if (!currentSession) {
      alert("Không có lớp học hiện tại");
      return;
    }

    try {
      setLoading(true);
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL("image/jpeg");

      // Gọi API nhận diện khuôn mặt
      const res = await axios.post("http://localhost:5000/recognize", { image: imgData });
      const { name, confidence, imageUrl } = res.data;

      if (name && confidence > 0.5) {
        // Gọi BE lưu điểm danh
        await axios.post("http://localhost:8080/api/attendance/record", {
          username: name,
          imageUrl,
          confidence
        });
        alert(`Điểm danh thành công! Xác suất: ${(confidence*100).toFixed(2)}%`);
      } else {
        alert("Không nhận diện được khuôn mặt. Thử lại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi điểm danh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3">
      <h3>Điểm danh tự động</h3>
      <p><b>Lớp hiện tại:</b> {currentSession?.className || "Không có lớp học"}</p>
      <video ref={videoRef} autoPlay style={{ width: 400 }}></video>

      {!faceEnrolled ? (
        <>
          <Button onClick={capturePhoto} className="m-2">Chụp ảnh</Button>
          <Button onClick={submitEnroll} className="m-2" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm"/> : "Đăng ký khuôn mặt"}
          </Button>
          <p>Đã chụp {photos.length} ảnh</p>
        </>
      ) : (
        <Button onClick={submitCheckIn} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm"/> : "Điểm danh"}
        </Button>
      )}
    </Card>
  );
};

export default FaceAttendance;
    