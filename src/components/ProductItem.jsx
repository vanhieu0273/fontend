// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContextReal'
// import { Link } from 'react-router-dom';

// const ProductItem = ({id, images, name, price}) => {
//   console.log(images);
  
//     const {currency} = useContext(ShopContext);
//   return (
//     <Link className='text-gray-700 cursor-pointer ' to={`/product/${id}`}>
//         <div className='overflow-hidden'>
//             {images && <img src={images[0]} className='hover:scale-110 transition ease-in-out' alt="" />}
//         </div>
//         <p className='pt-3 pb-1 text-sm'>{name}</p>
//         <p className='text-sm font-medium'>{currency}{price}</p>
//     </Link>
//   )
// }

// export default ProductItem


import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContextReal';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, images, name, price }) => {
  const { formatPrice } = useContext(ShopContext); 

  return (
    <Link
      className="text-gray-700 cursor-pointer flex flex-col rounded-lg overflow-hidden shadow hover:shadow-md transition duration-200"
      to={`/product/${id}`}
    >
      {/* Ảnh sản phẩm */}
      <div className="w-full aspect-[4/5] bg-white overflow-hidden">
        {images && (
          <img
            src={images[0]}
            alt={name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        )}
      </div>

      {/* Nội dung */}
      <div className="p-2 flex-grow flex flex-col justify-between">
        <p className="pt-2 text-sm line-clamp-2 min-h-[3rem]">{name}</p>
        <p className="text-sm font-medium text-red-500">
          {formatPrice(price)} 
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
