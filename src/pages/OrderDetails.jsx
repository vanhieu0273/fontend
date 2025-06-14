// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const OrderDetails = () => {
//   const { orderId } = useParams();

//   const [order, setOrder] = useState(null);
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await axios.get(`http://localhost:4000/payment/orders/${orderId}`);
//         console.log("Dữ liệu đơn hàng:", res.data);
//         setOrder(res.data.order);
//         setItems(res.data.items || []);
//       } catch (err) {
//         setError(err.response?.data?.message || "Không thể lấy thông tin đơn hàng");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) {
//       fetchOrder();
//     }
//   }, [orderId]);

//   if (loading) return <p className="p-6">Đang tải thông tin đơn hàng...</p>;
//   if (error) return <p className="p-6 text-red-600">{error}</p>;
//   if (!order) return <p className="p-6">Không tìm thấy đơn hàng.</p>;

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">
//         Chi tiết đơn hàng #{order._id}
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//         <div>
//           <h2 className="text-lg font-medium mb-2">Thông tin người nhận</h2>
//           <p><strong>Họ tên:</strong> {order.full_name}</p>
//           <p><strong>SĐT:</strong> {order.phone_number}</p>
//           <p><strong>Địa chỉ:</strong> {order.address}</p>
//           {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
//         </div>

//         <div>
//           <h2 className="text-lg font-medium mb-2">Thanh toán & Vận chuyển</h2>
//           <p>
//             <strong>Phương thức:</strong>{" "}
//             {order.payment_method === "cod" ? "COD" : "Chuyển khoản"}
//           </p>
//           <p>
//             <strong>Trạng thái:</strong>{" "}
//             {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
//           </p>
//           <p>
//             <strong>Ngày tạo:</strong>{" "}
//             {new Date(order.created_at).toLocaleString()}
//           </p>
//         </div>
//       </div>

//       <h2 className="text-lg font-medium mt-6 mb-2">Danh sách sản phẩm</h2>
//       <div className="divide-y border rounded">
//         {items.length > 0 ? (
//           items.map((item, index) => (
//             <div key={index} className="flex gap-4 p-4 items-center">
//               <div className="w-16 h-16 bg-gray-100 flex items-center justify-center border text-gray-400 text-xs">
//                 Ảnh
//               </div>
//               <div className="flex-1">
//                 <p className="font-medium">{item.name}</p>
//                 <p className="text-sm text-gray-600">
//                   Size ID: {item.size} - Màu ID: {item.color}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Số lượng: {item.quantity}
//                 </p>
//               </div>
//               <div className="text-right text-blue-600 font-semibold min-w-[80px]">
//                 {(item.price * item.quantity).toLocaleString()}đ
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="p-4 text-gray-500">Không có sản phẩm nào trong đơn hàng.</p>
//         )}
//       </div>

//       <div className="mt-6 text-right text-lg font-semibold">
//         Tổng cộng: {order.total_price?.toLocaleString() || "0"}đ
//       </div>

//       {order.payment_method === "bank_transfer" && order.bank_transfer_info && (
//         <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
//           <h2 className="font-medium mb-2 text-yellow-800">Thông tin chuyển khoản</h2>
//           <p><strong>Ngân hàng:</strong> {order.bank_transfer_info.bank_name}</p>
//           <p><strong>Số tài khoản:</strong> {order.bank_transfer_info.account_number}</p>
//           <p><strong>Chủ tài khoản:</strong> {order.bank_transfer_info.account_name}</p>
//           <p><strong>Số tiền:</strong> {order.bank_transfer_info.transfer_amount.toLocaleString()}đ</p>
//           <p><strong>Nội dung:</strong> {order.bank_transfer_info.transfer_content}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderDetails;

"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/payment/orders/${orderId}`);
        console.log("Dữ liệu đơn hàng:", res.data);
        setOrder(res.data.order);
        setItems(res.data.items || []);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể lấy thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return <p className="p-6">Đang tải thông tin đơn hàng...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!order) return <p className="p-6">Không tìm thấy đơn hàng.</p>;

  const formatAddress = (address) => {
    if (!address) return "";
    const { specific_address, ward, district, province } = address;
    return `${specific_address}, ${ward}, ${district}, ${province}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Chi tiết đơn hàng #{order._id}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h2 className="text-lg font-medium mb-2">Thông tin người nhận</h2>
          <p><strong>Họ tên:</strong> {order.full_name}</p>
          <p><strong>SĐT:</strong> {order.phone_number}</p>
          <p><strong>Địa chỉ:</strong> {formatAddress(order.address)}</p>
          {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">Thanh toán & Vận chuyển</h2>
          <p>
            <strong>Phương thức:</strong>{" "}
            {order.payment_method === "cod" ? "COD" : "Chuyển khoản"}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
          <p><strong>Phí vận chuyển:</strong> {order.shipping_fee?.toLocaleString()}đ</p>
        </div>
      </div>

      <h2 className="text-lg font-medium mt-6 mb-2">Danh sách sản phẩm</h2>
      <div className="divide-y border rounded">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex gap-4 p-4 items-center">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="w-16 h-16 object-cover border rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Size: {item.size_name} - Màu: {item.color_name}
                  <span className="inline-block ml-2 w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: item.color_code }}></span>
                </p>
                <p className="text-sm text-gray-600">
                  Số lượng: {item.quantity}
                </p>
              </div>
              <div className="text-right text-blue-600 font-semibold min-w-[80px]">
                {(item.price * item.quantity).toLocaleString()}đ
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">Không có sản phẩm nào trong đơn hàng.</p>
        )}
      </div>

      <div className="mt-6 text-right text-lg font-semibold">
        Tổng cộng: {order.total_price?.toLocaleString() || "0"}đ
      </div>

      {order.payment_method === "bank_transfer" && order.bank_transfer_info && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <h2 className="font-medium mb-2 text-yellow-800">Thông tin chuyển khoản</h2>
          <p><strong>Ngân hàng:</strong> {order.bank_transfer_info.bank_name}</p>
          <p><strong>Số tài khoản:</strong> {order.bank_transfer_info.account_number}</p>
          <p><strong>Chủ tài khoản:</strong> {order.bank_transfer_info.account_name}</p>
          <p><strong>Số tiền:</strong> {order.bank_transfer_info.transfer_amount.toLocaleString()}đ</p>
          <p><strong>Nội dung chuyển khoản:</strong> {order.bank_transfer_info.transfer_content}</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
