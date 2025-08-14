// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { authApis } from "../../configs/Apis";

// export default function DoMCPage() {
//   const { assignmentId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   // Load đề trắc nghiệm
//   useEffect(() => {
//     authApis()
//       .get(`/submission/doMC/${assignmentId}`)
//       .then(res => {
//         setQuestions(res.data.questions || []);
//       })
//       .catch(err => {
//         console.error("Lỗi load đề:", err);
//       });
//   }, [assignmentId]);

//   // Cập nhật đáp án đã chọn
//   const handleSelectAnswer = (questionId, answerId) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: answerId
//     }));
//   };

//   // Nộp bài
//   const handleSubmit = async e => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     setSuccess("");

//     try {
//       console.log("Answers gửi đi:", answers);

//       await authApis().post(
//         `/submission/multiple-choice?assignmentId=${assignmentId}`,
//         answers, // gửi JSON đúng format
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true
//         }
//       );

//       setSuccess("Nộp bài thành công!");
//       setTimeout(() => navigate(-1), 1500);
//     } catch (err) {
//       console.error(err.response || err);
//       setError("Nộp bài thất bại");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Làm bài trắc nghiệm</h2>
//       {questions.length === 0 && <p>Đang tải đề...</p>}
//       <form onSubmit={handleSubmit}>
//         {questions.map(q => (
//           <div key={q.id} style={{ marginBottom: "20px" }}>
//             <p><b>{q.questionText}</b></p>
//             {q.answers.map(a => (
//               <label key={a.id} style={{ display: "block" }}>
//                 <input
//                   type="radio"
//                   name={`question-${q.id}`}
//                   value={a.id}
//                   checked={answers[q.id] === a.id}
//                   onChange={() => handleSelectAnswer(q.id, a.id)}
//                 />
//                 {a.answerText}
//               </label>
//             ))}
//           </div>
//         ))}

//         {error && <p style={{ color: "red" }}>{error}</p>}
//         {success && <p style={{ color: "green" }}>{success}</p>}

//         <button type="submit" disabled={submitting}>
//           {submitting ? "Đang nộp..." : "Nộp bài"}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authApis } from "../../configs/Apis";

export default function DoMCPage() {
  const { assignmentId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [score, setScore] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Lấy thông tin bài
        const mcRes = await authApis().get(`/submission/doMC/${assignmentId}`);
        setQuestions(mcRes.data.questions || []);
        setDeadline(mcRes.data.deadline || null);

        // 2. Lấy thông tin bài đã nộp
        const myRes = await authApis().get(`/submission/mymc/${assignmentId}`);
        if (myRes.data) {
          setAlreadySubmitted(true);
          setScore(myRes.data.score ?? null);
          if (myRes.data.answers) {
            setAnswers(myRes.data.answers);
          }
        }
      } catch (err) {
        console.error("Lỗi load dữ liệu:", err);
        setError("Không tải được dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assignmentId]);

  const handleSelectAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      console.log("Answers gửi đi:", answers);
      await authApis().post(
        `/submission/multiple-choice?assignmentId=${assignmentId}`,
        answers,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      setSuccess("Nộp bài thành công!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error(err.response || err);
      setError("Nộp bài thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const isExpired = deadline && new Date(deadline) < new Date();

  if (loading) return <p>Đang tải...</p>;

  // Đã nộp => hiện điểm số
  if (alreadySubmitted) {
    return (
      <div>
        <h2>Bạn đã làm bài này</h2>
        {score !== null && <p>Điểm: <b>{score}</b></p>}
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  // Hết hạn mà chưa làm
  if (isExpired) {
    return (
      <div>
        <h2>Đã quá hạn nộp bài</h2>
        <p>Hạn cuối: {new Date(deadline).toLocaleString()}</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  // Còn hạn => cho làm bài
  return (
    <div>
      <h2>Làm bài trắc nghiệm</h2>
      <p>Hạn cuối: {deadline ? new Date(deadline).toLocaleString() : "Không có"}</p>
      <form onSubmit={handleSubmit}>
        {questions.map(q => (
          <div key={q.id} style={{ marginBottom: "20px" }}>
            <p><b>{q.questionText}</b></p>
            {q.answers.map(a => (
              <label key={a.id} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={a.id}
                  checked={answers[q.id] === a.id}
                  onChange={() => handleSelectAnswer(q.id, a.id)}
                />
                {a.answerText}
              </label>
            ))}
          </div>
        ))}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Đang nộp..." : "Nộp bài"}
        </button>
      </form>
    </div>
  );
}
