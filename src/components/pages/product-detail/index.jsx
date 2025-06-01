// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { ShopContext } from "../../../context/ShopContextReal";
// import { assets } from "../../../assets/frontend_assets/assets";
// import axiosInstance from "../../../config/axios";

// export default function ProductDetail() {
//   const { productId } = useParams();
//   const { currency, addToCart } = useContext(ShopContext);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState("");

//   const getProductById = async () => {
//     console.log("call");

//     await axiosInstance
//       .get(`/products/${productId}`)
//       .then((res) => {
//         console.log("res.data.product", res.data);
//         setProductData(res.data);
//         setImage(res.data.product.image[0]);
//         setSize(res.data.product.sizes[0]);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   useEffect(() => {
//     getProductById();
//   }, [productId]); // chia khi productId thay doi thi moi goi lai api

//   return productData ? (
//     <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
//       {/* product data */}
//       <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row ">
//         {/* product image */}
//         <div className="flex-1 flex flex-col-reversed gap-3 sm:flex-row">
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.8%] w-full">
//             {productData.images.map((item, index) => (
//               <img
//                 onClick={() => setImage(item)}
//                 src={item}
//                 key={index}
//                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0  cursor-pointer "
//                 alt=""
//               />
//             ))}
//           </div>
//           <div className="w-full sm:w-[80%]">
//             <img src={image} className="w-full h-auto" alt="" />
//           </div>
//         </div>
//         {/* product info */}
//         <div className="flex-1">
//           <h1 className="font-medium text-2xl mt-2 ">{productData.name}</h1>
//           <div className="flex items-center gap-1 mt-2 ">
//             <img src={assets.star_icon} alt="" className="w-3 5" />
//             <img src={assets.star_icon} alt="" className="w-3 5" />
//             <img src={assets.star_icon} alt="" className="w-3 5" />
//             <img src={assets.star_icon} alt="" className="w-3 5" />
//             <img src={assets.star_dull_icon} alt="" className="w-3 5" />
//             <p className="pl-2">(122)</p>
//           </div>
//           <p className="mt-5 text-3xl font-medium">
//             {currency}
//             {productData.price}
//           </p>
//           <p className="mt-5 text-gray-500 md:w-4/5">
//             {productData.description}
//           </p>
//           <div className="flex flex-col gap-4 my-8">
//             <p>Select Size</p>
//             <div className="flex gap-2">
//               {/* {productData.size.map((item, index) => (
//                   <button className='border py-2 px-4 bg-gray-100' key={index}>{item}</button>
//                 ))} */}
//               {/* {productData?.sizes?.map((item, index) => (
//                 <button
//                   onClick={() => setSize(item)}
//                   className={`border py-2 px-4 bg-gray-100 ${
//                     item === size ? "border-orange-500" : ""
//                   }`}
//                   key={index}
//                 >
//                   {item}
//                 </button>
//               ))} */}
//             </div>
//           </div>
//           <button
//             onClick={() => addToCart(productData._id, size)}
//             className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 "
//           >
//             ADD TO CART
//           </button>
//           <hr className="mt-8 sm:w-4/5" />
//           <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//             <p>100%Original product.</p>
//             <p>cash on delivery is available on this product.</p>
//             <p>easy return and exchange policy within 7 days</p>
//           </div>
//         </div>
//       </div>
//       {/* description & review section */}
//       <div className="mt-20">
//         <div className="flex">
//           <b className="border px-5 py-3 text-sm">Description</b>
//           <p className="border px-5 py-3 text-sm">Review (122)</p>
//         </div>
//         <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
//           <p>{productData.description}</p>
//           <p>100%Original product.</p>
//           <p>cash on delivery is available on this product.</p>
//           <p>easy return and exchange policy within 7 days</p>
//         </div>
//       </div>
//       {/* display related product */}
//       {/* <RelatedProducts
//         category={productData.category}
//         subCategory={productData.subCategory}
//       /> */}
//     </div>
//   ) : (
//     <div className="opacity-0"></div>
//   );
// }

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../../context/ShopContextReal";
import { assets } from "../../../assets/frontend_assets/assets";
import axiosInstance from "../../../config/axios";

export default function ProductDetail() {
  const { productId } = useParams();

  const { addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(undefined);
  const [stock, setStock] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const getProductById = async () => {
    try {
      const res = await axiosInstance.get(`/products/${productId}`);
      const product = res.data;
      if (product && product.images?.length > 0) {
        setProductData(product);
        setImage(product.images[0]);
      } else {
        console.warn("Không tìm thấy sản phẩm trong phản hồi API.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    getProductById();
  }, [productId]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(undefined);
    setStock(null);
  };

  const handleSizeSelect = (sizeId, size) => {
    setSelectedSize(size);

    const variant = productData.variants.find(
      (v) => v.color._id === selectedColor._id
    );
    const selected = variant?.sizes.find((s) => s.size._id === sizeId);
    setStock(selected?.quantity || null);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setSuccessMessage(
        "Vui lòng chọn màu và kích cỡ trước khi thêm vào giỏ hàng."
      );
      return;
    }

    const variant = productData.variants.find(
      (v) => v.color._id === selectedColor._id
    );
    const selected = variant?.sizes.find(
      (s) => s.size._id === selectedSize?._id
    );

    if (!selected || selected.quantity <= 0) {
      setSuccessMessage("Sản phẩm đã hết hàng.");
      return;
    }

    addToCart(
      productData._id,
      selectedSize,
      selectedColor,
      productData.price,
      productData.images[0],
      productData.name
    );
  };

  const isAddToCartDisabled = !(selectedColor && selectedSize?._id);

  return productData ? (
    <div className="border-t-2 pt-10 relative">
      {/* Thông báo thêm vào giỏ */}
      {successMessage && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 border border-green-400 px-4 py-2 rounded shadow z-10">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-12 mt-5">
        {/* product images */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[18%] w-full max-h-60 sm:max-h-[400px]">
            {productData.images.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} className="w-full h-auto" alt="" />
          </div>
        </div>

        {/* product info */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium mt-2">{productData.name}</h1>
          <div className="flex gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <img src={assets.star_icon} alt="" key={i} className="w-3.5" />
            ))}
            <img src={assets.star_dull_icon} alt="" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{productData.price}</p>

          {/* Select color */}
          <div className="mt-6">
            <p>Chọn màu:</p>
            <div className="flex gap-2 mt-2">
              {productData.variants.map((variant) => (
                <button
                  key={variant.color._id}
                  className={`px-4 py-2 border rounded ${
                    selectedColor?.name === variant.color.name
                      ? "border-orange-500"
                      : "bg-gray-100"
                  }`}
                  onClick={() => handleColorSelect(variant.color)}
                >
                  {variant.color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Select size */}
          {selectedColor && (
            <div className="mt-6">
              <p>Chọn kích cỡ:</p>
              <div className="flex gap-2 mt-2">
                {productData.variants
                  .find((v) => v.color._id === selectedColor._id)
                  ?.sizes.map((s) => (
                    <button
                      key={s.size._id}
                      className={`px-4 py-2 border rounded ${
                        selectedSize?._id === s?.size?._id
                          ? "border-orange-500"
                          : "bg-gray-100"
                      }`}
                      onClick={() => handleSizeSelect(s.size._id, s.size)}
                    >
                      {s.size.name}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Show stock */}
          {stock !== null && (
            <p className="mt-4 text-green-700">
              Số lượng còn lại: <b>{stock}</b>
            </p>
          )}

          <button
            onClick={handleAddToCart}
            className={`mt-6 px-8 py-3 text-sm text-white ${
              isAddToCartDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black"
            }`}
            disabled={isAddToCartDisabled}
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% sản phẩm chính hãng.</p>
            <p>Thanh toán khi nhận hàng.</p>
            <p>Đổi/trả dễ dàng trong 7 ngày.</p>
          </div>
        </div>
      </div>

      {/* mô tả & đánh giá */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Mô tả</b>
          <p className="border px-5 py-3 text-sm">Đánh giá (122)</p>
        </div>
        <div className="border px-6 py-6 text-sm text-gray-500">
          <p>{productData.description}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center mt-20 text-gray-500">Đang tải sản phẩm...</div>
  );
}
