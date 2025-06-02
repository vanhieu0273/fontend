import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContextReal'
import { Link } from 'react-router-dom';

const ProductItem = ({id, images, name, price}) => {
  console.log(images);
  
    const {currency} = useContext(ShopContext);
  return (
    <Link className='text-gray-700 cursor-pointer ' to={`/product/${id}`}>
        <div className='overflow-hidden'>
            {images && <img src={images[0]} className='hover:scale-110 transition ease-in-out' alt="" />}
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem