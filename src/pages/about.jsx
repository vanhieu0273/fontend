import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const about = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'VỀ CHÚNG TÔI'} text2={''} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img src={assets.about_img} alt="" className='w-full md:max-w-[450px]' />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>WEBTHETHAO được ra đời từ niềm đam mê đổi mới và mong muốn cách mạng hóa trải nghiệm mua sắm trực tuyến. Hành trình của chúng tôi bắt đầu với một ý tưởng đơn giản: tạo ra nền tảng giúp khách hàng dễ dàng khám phá, tìm hiểu và mua sắm đa dạng sản phẩm ngay tại nhà.</p>
          <p>Từ những ngày đầu, chúng tôi đã nỗ lực không ngừng để tuyển chọn các sản phẩm chất lượng cao, phong phú về mẫu mã nhằm đáp ứng mọi sở thích và nhu cầu. Từ thời trang, làm đẹp đến điện tử và đồ gia dụng, tất cả đều được chọn lọc từ những thương hiệu uy tín và nhà cung cấp đáng tin cậy.</p>
          <b className='text-gray-800'>Sứ Mệnh Của Chúng Tôi</b>
          <p>Sứ mệnh của WEBTHETHAO là mang đến cho khách hàng sự lựa chọn đa dạng, sự tiện lợi và sự tin tưởng. Chúng tôi cam kết đem lại trải nghiệm mua sắm liền mạch, từ việc duyệt sản phẩm, đặt hàng cho đến giao hàng và hơn thế nữa.</p>
        </div>
      </div>
      <div className='text-xl py-4 '>
        <Title text1={'TẠI SAO CHỌN CHÚNG TÔI'} text2={''} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Đảm Bảo Chất Lượng:</b>
          <p className='text-gray-600'>Chúng tôi lựa chọn và kiểm định kỹ lưỡng từng sản phẩm để đảm bảo đạt tiêu chuẩn chất lượng khắt khe nhất.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Tiện Lợi:</b>
          <p className='text-gray-600'>Với giao diện thân thiện và quy trình đặt hàng đơn giản, việc mua sắm trở nên dễ dàng hơn bao giờ hết.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Dịch Vụ Khách Hàng Xuất Sắc:</b>
          <p className='text-gray-600'>Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng đồng hành cùng bạn, đảm bảo sự hài lòng của bạn là ưu tiên hàng đầu.</p>
        </div>
      </div>
      {/* <NewsletterBox /> */}
    </div>
  )
}

export default about
