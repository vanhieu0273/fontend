// import React, { useEffect, useState } from 'react';
// import Title from './Title';
// import ProductItem from './ProductItem';

// const LatestCollection = () => {
//   const [latestProducts, setLatestProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await fetch('http://localhost:4000/products');
//         const data = await res.json();

//         if (Array.isArray(data)) {
//           // Trường hợp API trả về một mảng
//           setLatestProducts(data.slice(0, 10));
//         } else if (Array.isArray(data.products)) {
//           // Trường hợp API trả về object chứa mảng products
//           setLatestProducts(data.products.slice(0, 10));
//         } else {
//           console.error('Dữ liệu API không đúng định dạng:', data);
//         }
//       } catch (error) {
//         console.error('Lỗi khi fetch sản phẩm:', error);
//       }
//     };

//     fetchProducts();
//   }, []);
//   console.log('latestProducts', latestProducts);
  
//   return (
//     <div className='my-10'>
//       <div className='text-center py-8 text-3xl'>
//         <Title text1={'DANH SÁCH SẢN PHẨM'} text2={''} />
//         <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
//           Khám phá bộ sưu tập mới nhất với những thiết kế hiện đại và chất lượng cao.
//         </p>
//       </div>

//       <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
//         {latestProducts.map((item, index) => (
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

// export default LatestCollection;


import React, { useEffect, useState } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
import axiosInstance from '../config/axios';

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        const data = res.data;

        if (Array.isArray(data)) {
          setLatestProducts(data.slice(0, 10));
        } else if (Array.isArray(data.products)) {
          setLatestProducts(data.products.slice(0, 10));
        } else {
          console.error('Dữ liệu API không đúng định dạng:', data);
        }
      } catch (error) {
        console.error('Lỗi khi fetch sản phẩm:', error);
      }
    };

    fetchProducts();
  }, []);
  console.log('latestProducts', latestProducts);
  
  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'DANH SÁCH SẢN PHẨM'} text2={''} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Khám phá bộ sưu tập mới nhất với những thiết kế hiện đại và chất lượng cao.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map((item, index) => (
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

export default LatestCollection;