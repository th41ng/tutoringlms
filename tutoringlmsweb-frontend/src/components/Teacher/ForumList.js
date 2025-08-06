import { useContext, useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/Context";

const ForumList = () => {
  const { user } = useContext(MyUserContext); // ✅ lấy role từ context
  const [forums, setForums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadForums = async () => {
      try {
        const ep =
          user.role === "ROLE_TEACHER"
            ? endpoints["get_all_forums"]
            : endpoints["get_my_class_forum"];
        const res = await authApis().get(ep);
        setForums(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error("❌ Lỗi khi tải diễn đàn:", err);
      }
    };

    if (user) loadForums();
  }, [user]);

  return (
    <div>
      <h2>Danh sách diễn đàn</h2>
      <ul>
        {forums.map((f) => (
          <li key={f.id}>
            <button onClick={() => navigate(`/forums/${f.classId}`)}>
              {f.className ? `Forum: ${f.className}` : `Forum #${f.classId}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ForumList;