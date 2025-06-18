// import React, { useEffect, useState } from 'react';
// import Title from './Title';
// import ProductItem from './ProductItem';

// const BestSeller = () => {
//   const [bestSeller, setBestSeller] = useState([]);

//   useEffect(() => {
//     const fetchBestSellers = async () => {
//       try {
//         const res = await fetch('http://localhost:4000/products/top-selling');
//         const data = await res.json();

//         if (Array.isArray(data)) {
//           setBestSeller(data.slice(0, 5));
//         } else if (Array.isArray(data.products)) {
//           setBestSeller(data.products.slice(0, 5));
//         } else {
//           console.error('Dữ liệu từ API không đúng định dạng:', data);
//         }
//       } catch (error) {
//         console.error('Lỗi khi fetch sản phẩm bán chạy:', error);
//       }
//     };

//     fetchBestSellers();
//   }, []);

//   return (
//     <div className='my-10'>
//       <div className='text-center py-8 text-3xl'>
//         <Title text1={'SẢN PHẨM BÁN CHẠY'} text2={''} />
//         <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
//           Khám phá những sản phẩm được yêu thích và bán chạy nhất trên cửa hàng của chúng tôi.
//         </p>
//       </div>

//       <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
//         {bestSeller.map((item, index) => (
//           <ProductItem
//             key={index}
//             id={item._id}
//             images={item.images}
//             name={item.name}
//             price={item.price}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BestSeller;


import React, { useEffect, useState } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
import axiosInstance from '../config/axios';

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await axiosInstance.get('/products/top-selling');
        const data = res.data;

        if (Array.isArray(data)) {
          setBestSeller(data.slice(0, 5));
        } else if (Array.isArray(data.products)) {
          setBestSeller(data.products.slice(0, 5));
        } else {
          console.error('Dữ liệu từ API không đúng định dạng:', data);
        }
      } catch (error) {
        console.error('Lỗi khi fetch sản phẩm bán chạy:', error);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'SẢN PHẨM BÁN CHẠY'} text2={''} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Khám phá những sản phẩm được yêu thích và bán chạy nhất trên cửa hàng của chúng tôi.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            images={item.images}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;