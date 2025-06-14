import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContextReal';
import Title from '../components/Title';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    console.log('cartItems:', cartItems);
    setCartData(cartItems);
  }, [cartItems]);

  return (
    <div className="border-t pt-14 px-4 sm:px-10">
      <div className="mb-3">
        <Title text1={'GIỎ HÀNG CỦA BẠN!'} text2={''} />
      </div>

      <div>
        {cartData.length === 0 && (
          <p className="text-center text-gray-500 py-10">Giỏ hàng của bạn đang trống.</p>
        )}

        {cartData.map((item, index) => {
          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4"
            >
              {/* Thông tin sản phẩm */}
              <div className="flex items-start gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 sm:w-20 object-cover rounded"
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap text-sm sm:text-base">
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 rounded">{item.price}</p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 rounded">{item.size.name}</p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 rounded">{item.color.name}</p>
                  </div>
                </div>
              </div>

              {/* Số lượng */}
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '' || Number(val) < 1) return;
                  updateQuantity(item._id, item.size, item.color, Number(val));
                }}
                className="border max-w-[60px] px-2 py-1 text-center rounded"
              />

              {/* Tổng giá */}
              <div className="font-semibold">
                {item.price * item.quantity}
              </div>

              {/* Nút xoá */}
              <img
                onClick={() => updateQuantity(item._id, item.size, item.color, 0)}
                className="w-5 sm:w-6 cursor-pointer hover:opacity-70"
                src={assets.bin_icon}
                alt="Remove from cart"
                title="Xóa sản phẩm"
              />

            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate('/place-order')}
              className="bg-black text-white text-sm my-8 px-8 py-3 rounded hover:bg-gray-800 transition"
              disabled={cartData.length === 0}
            >
              Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
