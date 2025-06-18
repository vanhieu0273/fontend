import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContextReal'
import Title from './Title'

const CartTotal = () => {

    const { currency, delivery_free, getCartAmount } = useContext(ShopContext)

    const formatCurrency = (amount) => {
        return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    }

    const subTotal = getCartAmount()
    const total = subTotal 

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'TỔNG'} text2={'GIỎ HÀNG'} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Tạm tính</p>
                    <p>{formatCurrency(subTotal)}</p>
                </div>
                <hr />
                {/* Nếu muốn hiện phí vận chuyển thì mở phần này */}
                {/* <div className='flex justify-between'>
                    <p>Phí vận chuyển</p>
                    <p>{formatCurrency(delivery_free)}</p>
                </div>
                <hr /> */}
                <div className='flex justify-between'>
                    <b>Tổng cộng</b>
                    <b>{formatCurrency(total)}</b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
