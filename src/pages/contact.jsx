import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'LIÊN HỆ VỚI CHÚNG TÔI'} text2={''} />
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} alt="" className='w-full md:max-w-[480px]' />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Cửa Hàng Của Chúng Tôi</p>
          <p className='text-gray-500'>54709 Willms Station <br />
            Tầng 3, Washington, Hoa Kỳ</p>
          <p className='text-gray-500'>Điện thoại: (415) 555-0132 <br />
            Email: admin@forever.com</p>
          <p className='font-semibold text-xl text-gray-600'>Cơ Hội Nghề Nghiệp Tại WEBTHETHAO</p>
          <p className='text-gray-500'>Tìm hiểu thêm về các đội nhóm và vị trí tuyển dụng của chúng tôi.</p>
          {/* <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
            Xem Cơ Hội Việc Làm
          </button> */}
        </div>
      </div>
      {/* <NewsletterBox /> */}
    </div>
  )
}

export default contact
