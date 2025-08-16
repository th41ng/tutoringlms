import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { authApis } from "../../configs/Apis";

export default function ViewSubmissions() {
  const { assignmentId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type"); // ESSAY hoặc MULTIPLE_CHOICE
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState("");

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await authApis().get(`/assignments/${assignmentId}/submissions`, {
          params: { type }
        });
        setSubmissions(res.data);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        setError("Không tải được danh sách nộp bài");
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [assignmentId, type]);

  const openGradeModal = (submission) => {
    setCurrentSubmission(submission);
    setGradeInput(submission.grade ?? "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentSubmission(null);
    setGradeInput("");
  };

  const submitGrade = async () => {
    try {
      // Gọi API để lưu điểm, ví dụ endpoint POST /api/assignments/{assignmentId}/submissions/{studentId}/grade
      await authApis().post(`/assignments/${assignmentId}/submissions/${currentSubmission.studentId}/grade`, {
        grade: gradeInput
      });

      // Cập nhật state local để không phải reload
      setSubmissions(submissions.map(sub =>
        sub.studentId === currentSubmission.studentId ? { ...sub, grade: gradeInput } : sub
      ));
      closeModal();
    } catch (err) {
      console.error("Lỗi khi lưu điểm:", err.response?.data || err.message);
      alert("Lưu điểm thất bại");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Danh sách nộp bài ({type})</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Học sinh</th>
            <th>Ngày nộp</th>
            <th>Trễ hạn</th>
            {type === "MULTIPLE_CHOICE" && <th>Điểm</th>}
            {type === "ESSAY" && <th>Điểm</th>}
            {type === "ESSAY" && <th>Bài làm</th>}
            {type === "ESSAY" && <th>Chấm điểm</th>}
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, idx) => {
            const submittedAt = new Date(sub.submittedAt).toLocaleString();
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{sub.studentName}</td>
                <td>{submittedAt}</td>
                <td>{sub.isLate ? "Có" : "Không"}</td>
                <td>{sub.score ?? sub.grade ?? "Chưa chấm"}</td>
                {type === "ESSAY" && (
                  <td>
                    {sub.fileUrl ? (
                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">Tải file</a>
                    ) : (
                      <span>{sub.content || "Không có nội dung"}</span>
                    )}
                  </td>
                )}
                {type === "ESSAY" && (
                  <td>
                    <button onClick={() => openGradeModal(sub)}>Chấm điểm</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal chấm điểm */}
      {modalOpen && currentSubmission && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ backgroundColor: "white", padding: 20, width: 400, borderRadius: 8 }}>
            <h3>Chấm điểm: {currentSubmission.studentName}</h3>
            <p><strong>Bài làm:</strong></p>
            {currentSubmission.fileUrl ? (
              <a href={currentSubmission.fileUrl} target="_blank" rel="noopener noreferrer">Tải file</a>
            ) : (
              <p>{currentSubmission.content || "Không có nội dung"}</p>
            )}
            <p>
              <label>Điểm: </label>
              <input
                type="number"
                value={gradeInput}
                onChange={(e) => setGradeInput(e.target.value)}
                min="0"
                max="10"
              />
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={submitGrade}>Lưu</button>
              <button onClick={closeModal}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
