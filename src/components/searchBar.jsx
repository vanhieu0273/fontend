import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextReal'
import { assets } from '../assets/frontend_assets/assets';

import { useLocation, useNavigate } from 'react-router-dom';



const searchBar = () => {

    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    // const location = useLocation();
    const navigate = useNavigate();


    
    useEffect(() => {
            
            setVisible(true);
        
    }, [location])


  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 text-center '>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
            <input type="text" placeholder='Search' className='flex-1 outline-none bg-inherit text-sm' value={search} onChange={(e) => setSearch(e.target.value)}/>
            <img onClick={()=> search && navigate(`/collection?search=${search}`)} src={assets.search_icon} className='w-4' alt="" />
        </div>
        <img src={assets.cross_icon} className='inline w-3 cursor-pointer' onClick={()=> setShowSearch(false)} alt="" />
    </div>
  ) : null
}

export default searchBar