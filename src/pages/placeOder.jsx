'use client';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContextReal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';

const PlaceOrder = () => {
  const { cartItems, setCartItems } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [bankDetails, setBankDetails] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [address, setAddress] = useState('');
  const [specificAddr, setSpecificAddr] = useState('');

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'
        );
        setProvinces(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh/thành:', error);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const city = provinces.find((p) => p.Id === selectedCity);
      setDistricts(city?.Districts || []);
      setSelectedDistrict('');
      setWards([]);
      setSelectedWard('');
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      const city = provinces.find((p) => p.Id === selectedCity);
      const district = city?.Districts.find((d) => d.Id === selectedDistrict);
      setWards(district?.Wards || []);
      setSelectedWard('');
    }
  }, [selectedDistrict]);

  useEffect(() => {
    const cityName = provinces.find((p) => p.Id === selectedCity)?.Name || '';
    const districtName =
      districts.find((d) => d.Id === selectedDistrict)?.Name || '';
    const wardName = wards.find((w) => w.Id === selectedWard)?.Name || '';

    const fullAddress =
      wardName && districtName && cityName
        ? `${wardName}, ${districtName}, ${cityName}`
        : '';
    setAddress(fullAddress);
  }, [selectedCity, selectedDistrict, selectedWard]);

  const handlePlaceOrder = async () => {
    if (!fullName || !phoneNumber || !selectedCity || !selectedDistrict || !selectedWard || cartItems.length === 0) {
      setMessage('Vui lòng điền đầy đủ thông tin và kiểm tra giỏ hàng.');
      setBankDetails(null);
      setShowPopup(true);
      return;
    }

    const cityName = provinces.find((p) => p.Id === selectedCity)?.Name || '';
    const districtName = districts.find((d) => d.Id === selectedDistrict)?.Name || '';
    const wardName = wards.find((w) => w.Id === selectedWard)?.Name || '';

    const formData = {
      cartItems: cartItems.map((item) => ({
        product_id: item._id,
        name: item.name,
        size: item.size?._id,
        color: item.color?._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingInfo: {
        user_id: JSON.parse(localStorage.getItem('user'))?._id || null,
        full_name: fullName,
        phone_number: phoneNumber,
        province: cityName,
        district: districtName,
        ward: wardName,
        specific_address: specificAddr,
        note: note,
      },
      paymentMethod: method,
    };

    try {
      const response = await axiosInstance.post(
        '/payment/process',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(response.data.message || 'Đặt hàng thành công!');
      setBankDetails(response.data.payment?.bankDetails || null);
      setPaymentMessage(response.data.payment?.message || '');
      setOrderId(response.data.orderId);
      setShowPopup(true);
      
      localStorage.removeItem('cartItems');
    } catch (err) {
      console.error('LỖI:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng.');
      setBankDetails(null);
      setShowPopup(true);
    }

  };

  return (
    <div className="relative flex flex-col lg:flex-row justify-between gap-6 pt-10 px-6 min-h-screen">
      {/* Left - Form */}
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-4">Thông tin mua hàng</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />

            {/* Địa chỉ */}
            <select
              className="form-select form-select-sm border border-gray-300 rounded px-3 py-2"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Chọn tỉnh thành</option>
              {provinces.map((city) => (
                <option key={city.Id} value={city.Id}>
                  {city.Name}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm border border-gray-300 rounded px-3 py-2"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedCity}
            >
              <option value="">Chọn quận huyện</option>
              {districts.map((district) => (
                <option key={district.Id} value={district.Id}>
                  {district.Name}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm border border-gray-300 rounded px-3 py-2"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedDistrict}
            >
              <option value="">Chọn phường xã</option>
              {wards.map((ward) => (
                <option key={ward.Id} value={ward.Id}>
                  {ward.Name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Địa chỉ cụ thể"
              value={specificAddr}
              onChange={(e) => setSpecificAddr(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Ghi chú (tuỳ chọn)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Giữ nguyên phần vận chuyển + thanh toán */}
          <div>
            <div className="mt-6 lg:mt-0">
              <h3 className="font-semibold mb-2">Vận chuyển</h3>
              <div className="p-3 border border-gray-300 rounded text-sm">
                Giao hàng nội thành Hà Nội {'>'} 500k -{' '}
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Thanh toán</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={method === 'bank_transfer'}
                    onChange={() => setMethod('bank_transfer')}
                  />
                  <span>Chuyển khoản ngân hàng</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={method === 'cod'}
                    onChange={() => setMethod('cod')}
                  />
                  <span>Thanh toán khi giao hàng (COD)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Cart */}
      <div className="w-full lg:w-1/3 border border-gray-300 rounded p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">
          Đơn hàng ({cartItems.length} sản phẩm)
        </h2>

        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-contain border border-gray-300"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.size?.name} - {item.color?.name}
                </p>
                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                <p className="text-blue-600 font-semibold mt-1">
                  {(item.price * item.quantity).toLocaleString()}đ
                </p>
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
          <div className="flex justify-between font-semibold border-t border-gray-300 pt-2 mt-2 text-base">
            <span>Tổng cộng</span>
            <span>{totalPrice.toLocaleString()}đ</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded"
        >
          ĐẶT HÀNG
        </button>
      </div>

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gray-50 max-w-md w-full p-6 rounded shadow-lg relative pointer-events-auto">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              aria-label="Đóng popup"
            >
              &times;
            </button>

            <p className="text-lg font-semibold mb-3">{message}</p>

            {bankDetails && (
              <div className="space-y-4 text-sm">
                <p className="font-medium text-gray-700">{paymentMessage}</p>

                {[
                  ['Số tài khoản', bankDetails.account_number],
                  ['Tên tài khoản', bankDetails.account_name],
                  ['Ngân hàng', bankDetails.bank_name],
                  ['Số tiền', bankDetails.transfer_amount.toLocaleString() + 'đ'],
                  ['Nội dung chuyển khoản', bankDetails.transfer_content],
                ].map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center gap-3 border border-gray-200 rounded px-3 py-2"
                  >
                    <span className="font-medium truncate">{label}:</span>
                    <div className="flex items-center gap-4 min-w-0">
                      <p className="truncate text-gray-800 text-sm">{value}</p>
                      <button
                        onClick={() => copyToClipboard(value)}
                        className="text-blue-600 text-xs hover:underline hover:text-blue-800 whitespace-nowrap"
                      >
                        Sao chép
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setShowPopup(false);
                if (orderId) {
                  navigate(`/order/${orderId}`);
                }
              }}
              className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              KIỂM TRA HÀNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
