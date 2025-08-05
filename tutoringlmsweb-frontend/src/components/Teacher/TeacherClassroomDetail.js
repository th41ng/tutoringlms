  import React, { useState, useEffect } from 'react';
  import { useParams } from 'react-router-dom';
  import { Card, Table } from 'react-bootstrap';
  import { authApis } from '../../configs/Apis';

  const ClassroomDetail = () => {
    const { id } = useParams(); 
    const [classInfo, setClassInfo] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
      fetchClassDetail();
      fetchStudents();
    }, []);

    const fetchClassDetail = async () => {
      try {
        const res = await authApis().get(`/teacher/classroom/${id}`);
        setClassInfo(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin lớp:", err);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await authApis().get(`/teacher/classroom/${id}/students`);
        setStudents(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách học sinh:", err);
      }
    };


    if (!classInfo) return <h4>Đang tải thông tin lớp...</h4>;

    return (
      <div>
        <h2 className="mb-4">Chi tiết lớp học: {classInfo.className}</h2>

        <Card className="mb-4">
          <Card.Header>Thông tin lớp</Card.Header>
          <Card.Body>
            <p><strong>Lịch học:</strong> {classInfo.schedule}</p>
            <p><strong>Mã lớp:</strong> {classInfo.joinCode}</p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>Danh sách học sinh</Card.Header>
          <Table striped bordered hover responsive className="m-0">  
            <thead>
              <tr>
                <th>id</th>
                <th>Tên đăng nhập</th>
                <th>Họ tên</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={s.id}>
                  <td>{idx + 1}</td>
                  <td>{s.username}</td>
                  <td>{s.fullName}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    );
  };

  export default ClassroomDetail;
