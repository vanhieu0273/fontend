import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../../context/ShopContextReal";
// import { assets } from "../../../assets/frontend_assets/assets";
import axiosInstance from "../../../config/axios";
import { FaChevronLeft, FaChevronRight, FaStar, FaRegStar } from "react-icons/fa";

export default function   ProductDetail() {
  const { productId } = useParams();
  const { addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(undefined);
  const [stock, setStock] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  // Đánh giá
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Form đánh giá
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [canReview, setCanReview] = useState(false);

  const getProductById = async () => {
    try {
      const res = await axiosInstance.get(`/products/${productId}`);
      const product = res.data;
      if (product && product.images?.length > 0) {
        setProductData(product);
        setImage(product.images[0]);
        setImageIndex(0);
        setCanReview(product.canReview || false);
        setAverageRating(product.rating || 0);
      } else {
        console.warn("Không tìm thấy sản phẩm trong phản hồi API.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  // Lấy đánh giá sản phẩm
  const getProductReviews = async (page = 1) => {
    try {
      const res = await axiosInstance.get(`/products/${productId}/reviews?page=${page}&limit=5`);
      setReviews(res.data.reviews || []);
      setReviewCount(res.data.totalReviews || 0);
      setTotalReviewPages(res.data.totalPages || 1);
      setAverageRating(res.data.averageRating || 0);
    } catch (error) {
      setReviews([]);
      setReviewCount(0);
      setTotalReviewPages(1);
    }
  };

  useEffect(() => {
    getProductById();
    getProductReviews();
  }, [productId]);

  // Đổi ảnh chính khi bấm nút trái/phải
  const handleMainImageNav = (direction) => {
    if (!productData?.images) return;
    let newIndex = imageIndex;
    if (direction === "left") {
      newIndex = imageIndex === 0 ? productData.images.length - 1 : imageIndex - 1;
    } else {
      newIndex = imageIndex === productData.images.length - 1 ? 0 : imageIndex + 1;
    }
    setImageIndex(newIndex);
    setImage(productData.images[newIndex]);
  };

  // Đổi ảnh chính khi bấm thumbnail
  const handleThumbClick = (idx) => {
    setImage(productData.images[idx]);
    setImageIndex(idx);
  };

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

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    return price.toLocaleString("vi-VN");
  };

  // Gửi đánh giá
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    if (!userRating) {
      setReviewError("Vui lòng chọn số sao.");
      return;
    }
    if (!reviewText.trim()) {
      setReviewError("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    try {
      await axiosInstance.post(`/products/${productId}/reviews`, {
        rating: userRating,
        comment: reviewText,
      });
      setReviewSuccess("Đánh giá của bạn đã được gửi!");
      setUserRating(0);
      setHoverRating(0);
      setReviewText("");
      getProductReviews();
      getProductById();
    } catch (error) {
      setReviewError(
        error?.response?.data?.msg || "Không thể gửi đánh giá. Vui lòng thử lại."
      );
    }
  };

  // Hiển thị sao (dùng icon)
  const renderStars = (count, size = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= count ? (
          <FaStar key={i} color="#f59e42" size={size} />
        ) : (
          <FaRegStar key={i} color="#f59e42" size={size} />
        )
      );
    }
    return stars;
  };

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
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full sm:w-[80%] flex items-center justify-center">
            {/* Nút trái */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow"
              onClick={() => handleMainImageNav("left")}
              aria-label="Ảnh trước"
            >
              <FaChevronLeft />
            </button>
            {/* Ảnh chính với khung cố định */}
            <div className="w-full aspect-[4/5] flex items-center justify-center bg-white max-w-[400px] max-h-[500px] rounded overflow-hidden">
              <img
                src={image}
                className="object-cover w-full h-full"
                alt=""
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            {/* Nút phải */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow"
              onClick={() => handleMainImageNav("right")}
              aria-label="Ảnh sau"
            >
              <FaChevronRight />
            </button>
          </div>
          {/* Ảnh phụ phía dưới với khung cố định */}
          <div className="flex gap-2 mt-3 w-full justify-center">
            {productData.images.map((item, idx) => (
              <div
                key={idx}
                className={`w-14 h-14 rounded overflow-hidden border ${imageIndex === idx ? "border-orange-500" : "border-gray-200"}`}
                style={{ minWidth: "56px", minHeight: "56px" }}
              >
                <img
                  onClick={() => handleThumbClick(idx)}
                  src={item}
                  className="object-cover w-full h-full cursor-pointer"
                  alt=""
                  style={{ width: "56px", height: "56px" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* product info */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium mt-2">{productData.name}</h1>
          <div className="flex gap-1 mt-2 items-center">
            {renderStars(averageRating ? Math.round(averageRating) : 0, 14)}
            <span className="pl-2 text-gray-500 text-sm">
              ({reviewCount} đánh giá)
            </span>
          </div>
          <p className="mt-5 text-3xl font-medium text-red-500">
            {formatPrice(productData.price)} đ
          </p>

          {/* Select color */}
          <div className="mt-6">
            <p>Chọn màu:</p>
            <div className="flex gap-2 mt-2">
              {productData.variants.map((variant) => (
                <button
                  key={variant.color._id}
                  className={`px-4 py-2 border rounded ${selectedColor?.name === variant.color.name
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
                      className={`px-4 py-2 border rounded ${selectedSize?._id === s?.size?._id
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
            className={`mt-6 px-8 py-3 text-sm text-white ${isAddToCartDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black"
              }`}
            disabled={isAddToCartDisabled}
          >
            THÊM VÀO GIỎ HÀNG
          </button>

          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% sản phẩm chính hãng.</p>
            <p>Thanh toán khi nhận hàng.</p>
            <p>Đổi/trả dễ dàng trong 7 ngày.</p>
          </div>
        </div>
      </div>

      {/* Mô tả & Đánh giá tách riêng */}
      <div className="mt-20">
        {/* Tab chọn */}
        <div className="flex border-b">
          <button
            className={`px-5 py-3 text-sm border-t border-l border-r rounded-t ${activeTab === "description"
              ? "bg-white font-bold border-gray-300"
              : "bg-gray-100 text-gray-500 border-transparent"
              }`}
            onClick={() => setActiveTab("description")}
          >
            Mô tả
          </button>
          <button
            className={`px-5 py-3 text-sm border-t border-l border-r rounded-t ml-2 ${activeTab === "reviews"
              ? "bg-white font-bold border-gray-300"
              : "bg-gray-100 text-gray-500 border-transparent"
              }`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá ({reviewCount})
          </button>
        </div>
        {/* Nội dung tab */}
        <div className="border px-6 py-6 text-sm text-gray-500 bg-white rounded-b">
          {activeTab === "description" ? (
            <p>{productData.description}</p>
          ) : (
            <div>
              {/* Form đánh giá luôn hiển thị */}
              <form
                className="mb-8 border p-4 rounded bg-gray-50"
                onSubmit={handleSubmitReview}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="mr-2">Đánh giá của bạn:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(star)}
                      style={{ cursor: "pointer" }}
                    >
                      {star <= (hoverRating || userRating) ? (
                        <FaStar color="#f59e42" size={20} />
                      ) : (
                        <FaRegStar color="#f59e42" size={20} />
                      )}
                    </span>
                  ))}
                </div>
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  rows={3}
                  placeholder="Nhập nội dung đánh giá..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                {reviewError && (
                  <div className="text-red-500 mb-2">{reviewError}</div>
                )}
                {reviewSuccess && (
                  <div className="text-green-600 mb-2">{reviewSuccess}</div>
                )}
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-5 py-2 rounded"
                >
                  Gửi đánh giá
                </button>
              </form>

              {/* Danh sách đánh giá */}
              <div>
                {reviews.length === 0 ? (
                  <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                ) : (
                  <div>
                    {reviews.map((review, idx) => (
                      <div
                        key={review._id || idx}
                        className="mb-5 border-b pb-3 flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {review.user?.firstName || "Ẩn danh"}{" "}
                            {review.user?.lastName || ""}
                          </span>
                          <span className="flex">{renderStars(review.rating)}</span>
                          <span className="text-xs text-gray-400 ml-2">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString("vi-VN")
                              : ""}
                          </span>
                        </div>
                        <div className="text-gray-700">{review.comment}</div>
                      </div>
                    ))}
                    {/* Phân trang đánh giá */}
                    {totalReviewPages > 1 && (
                      <div className="flex gap-2 mt-4">
                        <button
                          disabled={reviewPage === 1}
                          onClick={() => {
                            setReviewPage((p) => p - 1);
                            getProductReviews(reviewPage - 1);
                          }}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Trước
                        </button>
                        <span>
                          Trang {reviewPage}/{totalReviewPages}
                        </span>
                        <button
                          disabled={reviewPage === totalReviewPages}
                          onClick={() => {
                            setReviewPage((p) => p + 1);
                            getProductReviews(reviewPage + 1);
                          }}
                          className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                          Sau
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center mt-20 text-gray-500">Đang tải sản phẩm...</div>
  );
}