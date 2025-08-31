import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ClassroomPaymentsPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await authApis().get(endpoints.listClasses);
      setClasses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lớp:", err);
      setError("Không thể tải danh sách lớp. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) return <div className="text-center mt-4"><Spinner animation="border" /></div>;

  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h3>Danh sách lớp học</h3>
      <div className="row mt-3">
        {classes.map((cls) => (
          <div className="col-md-4 mb-3" key={cls.id}>
            <Card>
              <Card.Body>
                <Card.Title>{cls.className}</Card.Title>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/classroom-payment-detail/${cls.id}`)}
                >
                  Xem học phí
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassroomPaymentsPage;
