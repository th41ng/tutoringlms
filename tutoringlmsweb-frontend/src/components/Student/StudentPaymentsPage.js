import React, { useEffect, useState } from "react";
import { authApis } from "../../configs/Apis";

const StudentPaymentPage = () => {
  const [classroom, setClassroom] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const classRes = await authApis().get("/student/classroom");
      if (!classRes.data) {
        alert("Bạn chưa tham gia lớp nào!");
        setLoading(false);
        return;
      }
      setClassroom(classRes.data);

      const payInfoRes = await authApis().get(`/class-payments/class/${classRes.data.id}`);
      setPaymentInfo(payInfoRes.data);

      // ✅ Lấy Payment hiện tại của học sinh
      const paymentRes = await authApis().get(`/payments/student/current/${classRes.data.id}`);
      setStatus(paymentRes.data?.status || "CHƯA NỘP"); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

const handleUpload = async () => {
  if (!proofFile) return alert("Chọn hình minh chứng!");
  if (!classroom) return alert("Chưa có lớp học!");

  try {
    const formData = new FormData();
    formData.append("file", proofFile);

    const res = await authApis().post(
      `/payments/upload-proof/${classroom.id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setStatus(res.data.status); 
    alert("Upload thành công, chờ giáo viên xác nhận.");
  } catch (err) {
    console.error(err);
    alert("Upload thất bại!");
  }
};


  if (loading) return <p>Đang tải...</p>;
  if (!paymentInfo) return <p>Chưa có thông tin thanh toán.</p>;

  return (
    <div className="container mt-4">
      <h3>Thanh toán học phí lớp {classroom.className}</h3>
      <p>Số tiền: {paymentInfo.amount} VND</p>
      <p>Tài khoản: {paymentInfo.bankAccount} ({paymentInfo.accountName})</p>
      {paymentInfo.qrCodeUrl && (
        <div>
          <p>Scan QR code để chuyển khoản:</p>
          <img src={paymentInfo.qrCodeUrl} alt="QR code" style={{ width: 200 }} />
        </div>
      )}
      <div className="mt-3">
        <input type="file" onChange={(e) => setProofFile(e.target.files[0])} />
        <button className="btn btn-success ms-2" onClick={handleUpload}>
          Upload minh chứng
        </button>
      </div>
      <p>Trạng thái: {status}</p>
    </div>
  );
};

export default StudentPaymentPage;
