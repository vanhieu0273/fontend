import React, { useEffect, useState } from 'react'
import axiosInstance from '../config/axios'
import Title from '../components/Title'
import { Link } from 'react-router-dom' // Thêm dòng này

const ListOrder = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/payment/user-orders')
        console.log('res', res.data)
        setOrders(res.data || []) // nếu API trả mảng luôn
      } catch (err) {
        setError('Không thể tải danh sách đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className='border-t pt-16 px-4'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'List Order'} />
      </div>

      {loading && <p>Đang tải đơn hàng...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="mt-4">Bạn chưa có đơn hàng nào.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-4 space-y-4">
          {orders.map((order, index) => (
            <div key={order._id || index} className="border p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p><strong>Mã đơn hàng:</strong> {order._id}</p>
                <p><strong>Tổng tiền:</strong> {order.total_price?.toLocaleString()}đ</p>
                <p>
                  <strong>Phương thức thanh toán:</strong>{" "}
                  {order.payment_method === "cod"
                    ? "COD"
                    : order.payment_method === "bank_transfer"
                      ? "Chuyển khoản"
                      : order.payment_method}
                </p>
                <p>
                  <strong>Trạng thái thanh toán:</strong>{" "}
                  {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {`${order.address?.specific_address}, ${order.address?.ward}, ${order.address?.district}, ${order.address?.province}`}
                </p>
              </div>
              <Link
                to={`/order/${order._id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                title="Xem chi tiết đơn hàng"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListOrder