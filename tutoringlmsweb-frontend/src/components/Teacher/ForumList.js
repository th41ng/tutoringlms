import { useContext, useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/Context";
import { Card, Table, Button, Badge } from "react-bootstrap";
import { ChatDots } from "react-bootstrap-icons"; 

const ForumList = () => {
  const { user } = useContext(MyUserContext);
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
        console.error("Lỗi khi tải diễn đàn:", err);
      }
    };

    if (user) loadForums();
  }, [user]);

  return (
    <div className="container mt-4">
      <Card className="shadow-sm">
        <Card.Header className="fw-bold bg-light">
          💬 Danh sách diễn đàn
        </Card.Header>
        <Card.Body>
          {forums.length === 0 ? (
            <p className="text-muted">⚠️ Chưa có diễn đàn nào</p>
          ) : (
            <Table striped bordered hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Tên lớp</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {forums.map((f, idx) => (
                  <tr key={f.id}>
                    <td>{idx + 1}</td>
                    <td>
                      {f.className ? (
                        <span className="fw-bold">{f.className}</span>
                      ) : (
                        <span className="text-muted">Không có tên</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/forums/${f.classId}`)}
                      >
                        <ChatDots className="me-1" />
                        Vào diễn đàn
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForumList;
