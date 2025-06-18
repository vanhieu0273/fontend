import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
            <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Chính sách đổi trả dễ dàng</p>
            <p className='text-gray-400'>Chúng tôi cung cấp chính sách đổi trả miễn phí </p>
        </div>
        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Chính sách đổi trả trong vòng 7 ngày</p>
            <p className='text-gray-400'>Chúng tôi cung cấp chính sách đổi trả miễn phí trong 7 ngày</p>
        </div>
        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Hỗ trợ khách hàng tốt nhất</p>
            <p className='text-gray-400'>Chúng tôi cung cấp hỗ trợ khách hàng 24/7</p>
        </div>
    </div>
  )
}

export default OurPolicy