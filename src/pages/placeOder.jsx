import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContextReal';

const PlaceOrder = () => {
  const { cartItems } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6 pt-10 px-6 min-h-screen">
      {/* Left - Thông tin mua hàng */}
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-4">Thông tin mua hàng</h2>

        {/* Grid chia 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cột trái: Form nhập thông tin */}
          <div>
            {/* Cột trái: Form nhập thông tin */}
            <div>
              <div className="grid grid-cols-1 gap-4">
                <input type="email" placeholder="Email" className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" placeholder="Họ và tên" className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" placeholder="Số điện thoại" className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" placeholder="Địa chỉ" className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" placeholder="Tỉnh thành" className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" placeholder="Quận huyện" className="border border-gray-300 rounded px-3 py-2" />
                <input type="text" placeholder="Phường xã" className="border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>

          </div>

          {/* Cột phải: Vận chuyển + Thanh toán */}
          <div>
            {/* Vận chuyển */}
            <div className="mt-6 lg:mt-0">
              <h3 className="font-semibold mb-2">Vận chuyển</h3>
              <div className="p-3 border border-gray-300 rounded text-sm">
                Giao hàng nội thành Hà Nội {'>'} 500k - <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
            </div>

            {/* Thanh toán */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Thanh toán</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" checked={method === 'bank'} onChange={() => setMethod('bank')} />
                  <span>Chuyển khoản ngân hàng</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="payment" checked={method === 'cod'} onChange={() => setMethod('cod')} />
                  <span>Thanh toán khi giao hàng (COD)</span>
                </label>
              </div>

              <div className="mt-4 border border-gray-300 rounded p-4 text-sm bg-gray-50">
                {method === 'bank' ? (
                  <>
                    <p>
                      Vui lòng ghi lại <strong>MÃ ĐƠN HÀNG</strong> và <strong>SỐ ĐIỆN THOẠI</strong> vào mục Nội dung thanh toán.
                      Đơn hàng sẽ được giao sau khi tiền đã được chuyển.
                    </p>
                    <p className="mt-2 italic">Ví dụ: webtt1234 - 0123456789</p>
                    <div className="mt-4">
                      <p className="font-semibold">Thông tin tài khoản:</p>
                      <p>PHUNG VAN HIEU</p>
                      <p>Tài khoản: 68686868</p>
                      <p>Ngân hàng: Ngân hàng quân đội - MB Bank</p>
                    </div>
                  </>
                ) : (
                  <p>* Tất cả các đơn hàng với sản phẩm vật lý đều được kiểm tra hàng trước khi thanh toán.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Right - Đơn hàng */}
      <div className="w-full lg:w-1/3 border border-gray-300 rounded p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Đơn hàng ({cartItems.length} sản phẩm)</h2>

        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-contain border border-gray-300" />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.size?.name} - {item.color?.name}
                </p>
                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                <p className="text-blue-600 font-semibold mt-1">{(item.price * item.quantity).toLocaleString()}đ</p>
              </div>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm.</p>
        )}

        <div className="text-sm border-t border-gray-300 pt-4">
          <div className="flex justify-between mb-2">
            <span>Tạm tính</span>
            <span>{totalPrice.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Phí vận chuyển</span>
            <span className="text-green-600">Miễn phí</span>
          </div>
          <div className="flex justify-between font-semibold border-t  border-gray-300 pt-2 mt-2 text-base">
            <span>Tổng cộng</span>
            <span>{totalPrice.toLocaleString()}đ</span>
          </div>
        </div>

        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded">ĐẶT HÀNG</button>
      </div>
    </div>
  );
};

export default PlaceOrder;
