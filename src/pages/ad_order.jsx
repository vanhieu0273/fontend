import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { FaEdit } from "react-icons/fa";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "waiting_payment", label: "Chờ thanh toán" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipped", label: "Đã giao hàng" },
  { value: "delivered", label: "Đã nhận hàng" },
  { value: "cancelled", label: "Đã hủy" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Chưa thanh toán" },
  { value: "completed", label: "Đã thanh toán" },
  { value: "failed", label: "Thanh toán thất bại" },
];

const getOrderStatusVN = (status) => {
  const found = ORDER_STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.label : status;
};

const getPaymentStatusVN = (status) => {
  const found = PAYMENT_STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.label : status;
};

const AdOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filterStatus === "all" ? {} : { status: filterStatus };
      const res = await axiosInstance.get("/payment/orders", { params });
      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [filterStatus]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString("vi-VN") + " đ";
  };

  // Lấy chi tiết đơn hàng khi bấm edit
  const handleEdit = async (orderId) => {
    setSelectedOrderId(orderId);
    setOrderDetail(null);
    try {
      const res = await axiosInstance.get(`/payment/orders/${orderId}`);
      setOrderDetail({
        ...res.data.order,
        items: res.data.items,
      });
    } catch (err) {
      alert("Không lấy được chi tiết đơn hàng!");
      setSelectedOrderId(null);
    }
  };

  // Lưu thay đổi trạng thái đơn hàng
  const handleSave = async () => {
    if (!orderDetail) return;
    setSaving(true);
    try {
      // Cập nhật trạng thái đơn hàng
      await axiosInstance.patch(
        `/payment/orders/${orderDetail._id}/status`,
        { status: orderDetail.status }
      );
      // Cập nhật trạng thái thanh toán
      await axiosInstance.patch(
        `/payment/orders/${orderDetail._id}/payment`,
        { payment_status: orderDetail.payment_status }
      );
      setSelectedOrderId(null);
      setOrderDetail(null);
      fetchOrders();
    } catch (err) {
      alert("Lưu thay đổi thất bại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-3">
        <select
          className="border px-3 py-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả</option>
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">MÃ ĐƠN</th>
              <th className="px-4 py-2 border">KHÁCH HÀNG</th>
              <th className="px-4 py-2 border">NGÀY ĐẶT</th>
              <th className="px-4 py-2 border">TỔNG TIỀN</th>
              <th className="px-4 py-2 border">TÌNH TRẠNG ĐƠN HÀNG</th>
              <th className="px-4 py-2 border">TRẠNG THÁI THANH TOÁN</th>
              <th className="px-4 py-2 border">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.order_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order.order_id}</td>
                  <td className="px-4 py-2 border">{order.customer || "Không rõ"}</td>
                  <td className="px-4 py-2 border">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-2 border">{formatCurrency(order.total_price)}</td>
                  <td className="px-4 py-2 border">{getOrderStatusVN(order.status)}</td>
                  <td className="px-4 py-2 border">{getPaymentStatusVN(order.payment_status)}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      className="text-gray-500 hover:text-blue-800"
                      onClick={() => handleEdit(order.order_id)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form chỉnh sửa đơn hàng */}
      {selectedOrderId && orderDetail && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setSelectedOrderId(null)}
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4">Chỉnh sửa đơn hàng</h2>
            <div className="mb-2">
              <b>Mã đơn:</b> {orderDetail._id}
            </div>
            <div className="mb-2">
              <b>Khách hàng:</b> {orderDetail.full_name}
            </div>
            <div className="mb-2">
              <b>Ngày đặt:</b> {formatDate(orderDetail.created_at)}
            </div>
            <div className="mb-2">
              <b>Tổng tiền:</b> {formatCurrency(orderDetail.total_price)}
            </div>
            <div className="mb-2">
              <b>Tình trạng đơn hàng:</b>
              <select
                className="border px-2 py-1 rounded ml-2"
                value={orderDetail.status}
                onChange={(e) =>
                  setOrderDetail((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <b>Trạng thái thanh toán:</b>
              <select
                className="border px-2 py-1 rounded ml-2"
                value={orderDetail.payment_status}
                onChange={(e) =>
                  setOrderDetail((prev) => ({
                    ...prev,
                    payment_status: e.target.value,
                  }))
                }
              >
                {PAYMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <b>Địa chỉ:</b>{" "}
              {orderDetail.address
                ? `${orderDetail.address.specific_address}, ${orderDetail.address.ward}, ${orderDetail.address.district}, ${orderDetail.address.province}`
                : ""}
            </div>
            <div className="mb-2">
              <b>Ghi chú:</b> {orderDetail.note || ""}
            </div>
            <div className="mb-2">
              <b>Danh sách sản phẩm:</b>
              <ul className="list-disc ml-6">
                {orderDetail.items?.map((item) => (
                  <li key={item._id}>
                    {item.product_name} - {item.size_name} - {item.color_name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setSelectedOrderId(null)}
                disabled={saving}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdOrder;