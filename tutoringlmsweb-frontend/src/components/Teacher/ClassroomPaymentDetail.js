import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Button, Spinner, Form, Alert, Badge } from "react-bootstrap";
import { authApis,endpoints } from "../../configs/Apis";

const fmtCurrency = (v) => {
  if (v === null || v === undefined) return "-";
  try {
    return new Intl.NumberFormat("vi-VN").format(v) + "₫";
  } catch {
    return `${v}₫`;
  }
};

const ClassroomPaymentDetail = () => {
  const { id } = useParams(); 
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rows, setRows] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
    const res = await authApis().get(endpoints.paymentsTable(id), { params: { year } });
      console.log("👉 /table response:", res.data);
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("❌ Lỗi lấy bảng học phí lớp:", e);
      setError("Không tải được dữ liệu học phí. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [id, year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const paymentMap = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      const perMonth = {};
      (r.payments || []).forEach((p) => {
        perMonth[p.paidMonth] = p;
      });
      map[r.studentId] = perMonth;
    });
    console.log("👉 paymentMap:", map);
    return map;
  }, [rows]);

  const togglePaid = async (paymentId) => {
    try {
      const res = await authApis().post(endpoints.togglePayment(paymentId));
      const updated = res.data;
      console.log("👉 Toggle response:", updated);

      setRows((prev) =>
        prev.map((r) => {
          const newPayments = (r.payments || []).map((p) =>
            p.id === updated.id
              ? {
                  ...p,
                  status: updated.status,
                  paidAt: updated.paidAt,
                }
              : p
          );
          return { ...r, payments: newPayments };
        })
      );
    } catch (e) {
      console.error("❌ Lỗi toggle:", e);
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Spinner animation="border" />
        <span>Đang tải dữ liệu học phí…</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Quản lý học phí</h2>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Bộ lọc năm / tháng */}
      <div className="d-flex gap-3 mb-3">
        <Form.Group style={{ maxWidth: 180 }}>
          <Form.Label>Năm</Form.Label>
          <Form.Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {/* Tùy bạn muốn hiện dải năm nào */}
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group style={{ maxWidth: 180 }}>
          <Form.Label>Tháng</Form.Label>
          <Form.Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex align-items-end">
          <Button variant="outline-primary" onClick={loadData}>
            Tải lại
          </Button>
        </div>
      </div>

      <Card>
        <Card.Header>
          Học phí tháng {month} năm {year}
        </Card.Header>
        <Table striped bordered hover responsive className="m-0 text-center align-middle">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th className="text-start">Học sinh</th>
              <th>Trạng thái</th>
              <th>Minh chứng</th>
              <th>Số tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  Không có dữ liệu.
                </td>
              </tr>
            )}

            {rows.map((r, idx) => {
              const p = paymentMap[r.studentId]?.[month]; // PaymentDTO của tháng đang chọn
              // Debug từng hàng
              console.log(`Student ${r.studentId} - month ${month}:`, p);

              const statusBadge =
                p?.status === "PAID" ? (
                  <Badge bg="success">ĐÃ ĐÓNG</Badge>
                ) : p?.status === "PENDING" ? (
                  <Badge bg="warning" text="dark">
                    CHỜ DUYỆT
                  </Badge>
                ) : p?.status === "UNPAID" ? (
                  <Badge bg="danger">CHƯA ĐÓNG</Badge>
                ) : (
                  <span>-</span>
                );

              return (
                <tr key={r.studentId}>
                  <td>{idx + 1}</td>
                  <td className="text-start">
                    <div className="fw-semibold">{r.studentName || r.fullName || "-"}</div>
                    {/* Nếu BE có thêm phone/email thì hiển thị nhẹ nhàng */}
                    {r.phone && <div className="text-muted small">📞 {r.phone}</div>}
                    {r.email && <div className="text-muted small">✉️ {r.email}</div>}
                  </td>
                  <td>{statusBadge}</td>
                  <td>
                    {p?.proofUrl ? (
                      <a href={p.proofUrl} target="_blank" rel="noopener noreferrer">
                        Xem minh chứng
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{fmtCurrency(p?.amount)}</td>
                  <td>
                    {p ? (
                      p.status === "PAID" ? (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => togglePaid(p.id)}
                          title="Đánh dấu chưa đóng"
                        >
                          Đánh dấu chưa đóng
                        </Button>
                      ) : (
                        <Button
                          variant={p.status === "PENDING" ? "success" : "primary"}
                          size="sm"
                          onClick={() => togglePaid(p.id)}
                          title={p.status === "PENDING" ? "Xác nhận đã đóng" : "Đánh dấu đã đóng"}
                        >
                          {p.status === "PENDING" ? "Xác nhận" : "Đánh dấu đã đóng"}
                        </Button>
                      )
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default ClassroomPaymentDetail;
