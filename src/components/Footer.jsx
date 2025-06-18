import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600'>
            WEBTHETHAO cam kết mang đến trải nghiệm mua sắm trực tuyến tiện lợi, đa dạng sản phẩm và chất lượng phục vụ hàng đầu cho khách hàng trên toàn quốc.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>CÔNG TY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Trang Chủ</li>
            <li>Giới Thiệu</li>
            <li>Giao Hàng</li>
            <li>Chính Sách Bảo Mật</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>LIÊN HỆ</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>0123 456 789</li>
            <li>hotro@forever.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>
          &copy; 2025 Bản quyền thuộc về <span className='font-semibold'>WEBTHETHAO</span>
        </p>
      </div>
    </div>
  )
}

export default Footer
