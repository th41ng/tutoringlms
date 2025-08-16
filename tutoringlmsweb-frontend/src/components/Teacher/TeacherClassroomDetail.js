import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, Form, Button } from 'react-bootstrap';
import { authApis } from '../../configs/Apis';
import dayjs from 'dayjs';

const ClassroomDetail = () => {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchClassDetail();
    fetchStudents();
  }, []);

  const fetchClassDetail = async () => {
  try {
    const res = await authApis().get(`/teacher/classroom/${id}`);
    setClassInfo(res.data);

    if (res.data.sessions && res.data.sessions.length > 0) {
      // Lấy ngày nhỏ nhất trong tuần
      const minDate = res.data.sessions.reduce((min, s) =>
        !min || dayjs(s.date).isBefore(min) ? s.date : min, null
      );

      const start = dayjs(minDate);
      const end = start.add(6, 'day'); // chỉ 1 tuần
      setStartDate(start.format('YYYY-MM-DD'));
      setEndDate(end.format('YYYY-MM-DD'));
    }
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

  const renderScheduleTable = () => {
  if (!startDate || !endDate) return null;

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const days = [];
  for (let d = start; d.isBefore(end.add(1, 'day')); d = d.add(1, 'day')) {
    days.push(d);
  }

  return (
    <Table bordered size="sm">
      <thead>
        <tr>
          {days.map(d => <th key={d.format('YYYY-MM-DD')}>{d.format('DD/MM/YYYY')}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          {days.map(d => {
            const sessionsInDay = classInfo.sessions?.filter(s => s.date === d.format('YYYY-MM-DD'));
            return (
              <td key={d.format('YYYY-MM-DD')}>
                {sessionsInDay && sessionsInDay.length > 0 ? (
                  sessionsInDay.map((s, idx) => (
                    <div key={idx}>{s.startTime} - {s.endTime}</div>
                  ))
                ) : (
                  <span>Không có buổi học</span>
                )}
              </td>
            )
          })}
        </tr>
      </tbody>
    </Table>
  )
};

  if (!classInfo) return <h4>Đang tải thông tin lớp...</h4>;

  return (
    <div>
      <h2 className="mb-4">Chi tiết lớp học: {classInfo.className}</h2>

      <Card className="mb-4">
        <Card.Header>Thông tin lớp</Card.Header>
        <Card.Body>
          <p><strong>Mã lớp:</strong> {classInfo.joinCode}</p>

          <Form className="mb-3 d-flex align-items-center">
            <Form.Label className="me-2 mb-0">Từ ngày:</Form.Label>
            <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <Form.Label className="ms-3 me-2 mb-0">Đến ngày:</Form.Label>
            <Form.Control type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </Form>

          {renderScheduleTable()}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Danh sách học sinh</Card.Header>
        <Table striped bordered hover responsive className="m-0">  
          <thead>
            <tr>
              <th>STT</th>
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
