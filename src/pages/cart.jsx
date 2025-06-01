// import React, { useContext, useEffect, useState } from 'react'
// import { ShopContext } from '../context/ShopContextReal'
// import Title from '../components/Title'
// import { assets } from '../assets/frontend_assets/assets';
// import CartTotal from '../components/CartTotal';

// const cart = () => {

//   const {products, currency, cartItems, updateQuantity, navigate} = useContext(ShopContext);

//   const [cartData, setCartData] = useState([]);

//   useEffect(() => {

//     const tempData = [];
//     for (const items in cartItems) {
//       for(const item in cartItems[items]){
//         if(cartItems[items][item] > 0){
//           tempData.push({
//             _id: items,
//             size: item,
//             quantity: cartItems[items][item]
//           })
//         }
//       }
//     }
//     setCartData(tempData);
    
//   }, [cartItems])

//   return (
//     <div className='border-t pt-14'>
//       <div className='text-wxl mb-3'>
//         <Title text1={'YOUR'} text2={'CART'}/>
//       </div>
//       <div>
//         {cartData.map((item, index) => {
//           const productData = products.find((product) => product._id === item._id);
//           return (
//             <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
//               <div className='flex items-start gap-6'>
//                 <img src={productData.image[0]} className='w-16 sm:w-20' alt="" />
//                 <div>
//                   <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
//                   <div className='flex items-center gap-5 mt-2'>
//                     <p>{currency}{productData.price}</p>
//                     <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
//                   </div>
//                 </div>
//               </div>
//               <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} type="number" min={1} defaultValue={item.quantity} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' />
//               <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
//             </div>
//           )
//         })}
//       </div>
//       <div className='flex justify-end my-20'>
//         <div className='w-full sm:w-[450px]'>
//           <CartTotal/>
//           <div className='w-full text-end'>
//             <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default cart
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
    const tempData = [];

    // for (const productId in cartItems) {
    //   for (const sizeKey in cartItems[productId]) {
    //     const quantity = cartItems[productId][sizeKey];
    //     if (quantity > 0) {
    //       console.log('productId:', productId, 'sizeKey:', sizeKey, 'quantity:', quantity);
    //       // Bắt buộc ép kiểu string cho sizeId, phòng trường hợp sizeKey là object
    //       const sizeId = typeof sizeKey === 'string' ? sizeKey : JSON.stringify(sizeKey);
    //       tempData.push({
    //         productId,
    //         sizeId,
    //         quantity,
    //         name,
    //       });
    //     }
    //   }
    // }

    setCartData(cartItems);
    console.log('cartData set to:', tempData);
  }, [cartItems]);


  // lấy từ local -> set vào state -> map data

  return (
    <div className="border-t pt-14 px-4 sm:px-10">
      <div className="mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.length === 0 && (
          <p className="text-center text-gray-500 py-10">Giỏ hàng của bạn đang trống.</p>
        )}

        {cartData.map((item, index) => {
          console.log('Rendering item:', item);
          
          // Ép id thành string khi tìm để tránh lỗi
          // const product = products.find(p => String(p._id) === String(item.productId));
          // if (!product) {
          //   console.warn('Product not found for id:', item.productId);
          //   return null;
          // }

          // const variantWithSize = product.variants.find(variant =>
          //   variant.sizes.some(size => size.size._id === item.sizeId)
          // );

          // if (!variantWithSize) {
          //   console.warn('Variant not found for sizeId:', item.sizeId, 'in product:', product.name);
          //   return null;
          // }

          // const sizeObj = variantWithSize.sizes.find(s => s.size._id === item.sizeId);

          // if (!sizeObj) {
          //   console.warn('Size not found:', item.sizeId, 'in variant:', variantWithSize);
          //   return null;
          // }

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 sm:w-20 object-cover rounded"
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="font-semibold">
                      {/* {currency} */}
                      {item.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 rounded">
                      {item.size.name}
                    </p>
                  </div>
                </div>
              </div>

              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '' || Number(val) < 1) return;
                  updateQuantity(item.productId, item.sizeId, Number(val));
                }}
                className="border max-w-[60px] px-2 py-1 text-center rounded"
              />

              <img
                onClick={() => updateQuantity(item.productId, item.sizeId, 0)}
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
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
