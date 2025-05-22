import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../../context/ShopContextReal";
import { assets } from "../../../assets/frontend_assets/assets";
import axiosInstance from "../../../config/axios";

export default function ProductDetail() {
  const { productId } = useParams();
  const { currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const getProductById = async () => {
    console.log('call');
    
    await axiosInstance.get(`/products/${productId}`)
      .then((res) => {
        console.log("res.data.product", res.data);
        setProductData(res.data);
        setImage(res.data.product.image[0]);
        setSize(res.data.product.sizes[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProductById();   
    }, [productId]); // chia khi productId thay doi thi moi goi lai api

  console.log("productId", productId);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row ">
        {/* product image */}
        <div className="flex-1 flex flex-col-reversed gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.8%] w-full">
            {productData.images.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0  cursor-pointer "
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
          <h1 className="font-medium text-2xl mt-2 ">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2 ">

            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {/* {productData.size.map((item, index) => (
                  <button className='border py-2 px-4 bg-gray-100' key={index}>{item}</button>
                ))} */}
              {/* {productData?.sizes?.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))} */}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 "
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100%Original product.</p>
            <p>cash on delivery is available on this product.</p>
            <p>easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>
      {/* description & review section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Review (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>{productData.description}</p>
          <p>100%Original product.</p>
          <p>cash on delivery is available on this product.</p>
          <p>easy return and exchange policy within 7 days</p>
        </div>
      </div>
      {/* display related product */}
      {/* <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      /> */}
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
}
