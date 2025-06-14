import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Pagination } from "antd";

const PAGE_SIZE = 10;

const AdProduct = () => {
  const [products, setProducts] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listColors, setListColors] = useState([]);
  const [listSizes, setListSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    images: [],
    category: "",
    isActive: true,
    discount: 0,
    feature: false,
    variants: [],
  });
  const [imageInput, setImageInput] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const getCategory = async () => {
    try {
      const res = await axiosInstance.get("/category");
      setListCategory(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getColors = async () => {
    try {
      const res = await axiosInstance.get("/color/list-color");
      setListColors(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getSizes = async () => {
    try {
      const res = await axiosInstance.get("/size/list-size");
      setListSizes(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async (categoryId = "", page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/products", {
        params: {
          category: categoryId || undefined,
          page,
          limit: PAGE_SIZE,
        },
      });
      setProducts(
        Array.isArray(response.data)
          ? response.data
          : response.data.products || []
      );
      setTotalPage(Number(response.data?.totalPages) || 1);
      setCurrentPage(Number(response.data?.currentPage) || 1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory, currentPage);
    getCategory();
    getColors();
    getSizes();
    // eslint-disable-next-line
  }, [selectedCategory, currentPage]);

  const calculateTotalQuantity = (variants) => {
    return variants.reduce((total, variant) => {
      const variantTotal = variant.sizes.reduce((sum, s) => sum + s.quantity, 0);
      return total + variantTotal;
    }, 0);
  };

  const formatVariants = (variants) => {
    return variants
      .map((variant) => {
        const colorName = variant.color?.name || variant.color || "Không rõ màu";
        const sizes = variant.sizes.map((s) => s.size?.name || s.size).join(", ");
        return `${colorName} (${sizes})`;
      })
      .join(" | ");
  };

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  const handleEditClick = async (id) => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      setEditingProduct(res.data);
      setShowEditModal(true);
      setSelectedColorIndex(null);
      setSelectedSizeIndex(null);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const payload = {
        ...editingProduct,
        category: editingProduct.category?._id || ""
      }
      await axiosInstance.put(`/products/${payload._id}`, payload);
      setShowEditModal(false);
      fetchProducts(selectedCategory, currentPage);
      console.log(payload);

    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        discount: Number(newProduct.discount),
        variants: newProduct.variants.map((v) => ({
          color: v.color,
          sizes: v.sizes.map((s) => ({
            size: s.size,
            quantity: Number(s.quantity),
          })),
        })),
      };
      console.log("Payload to add new product:", payload);

      await axiosInstance.post("/products", payload);
      setShowAddModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        images: [],
        category: "",
        isActive: true,
        discount: 0,
        feature: false,
        variants: [],
      });
      setImageInput("");
      fetchProducts(selectedCategory, currentPage);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm mới:", error);
    }
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput("");
    }
  };

  const removeImage = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addNewVariant = () => {
    setNewProduct((prev) => ({
      ...prev,
      variants: [...prev.variants, { color: "", sizes: [] }],
    }));
  };

  const addNewSizeForVariant = (colorIndex) => {
    setNewProduct((prev) => {
      const newVariants = [...prev.variants];
      newVariants[colorIndex].sizes.push({ size: "", quantity: 0 });
      return { ...prev, variants: newVariants };
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
          }}
        >
          <option value="">Tất cả danh mục</option>
          {listCategory.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : products.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => {
              const totalQuantity = calculateTotalQuantity(product.variants || []);
              const variantInfo = formatVariants(product.variants || []);
              const discountedPrice = calculateDiscountedPrice(
                product.price,
                product.discount
              );
              return (
                <div
                  key={product._id}
                  className="border rounded-lg p-4 flex gap-4 shadow-sm bg-white"
                >
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/120"}
                    alt={product.name}
                    className="w-28 h-28 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-1 text-gray-500 text-sm">
                      Phân loại: {product.category?.name || "Chưa phân loại"}
                    </div>
                    <div className="text-gray-500 text-sm">Biến thể: {variantInfo}</div>
                    <div className="text-gray-500 text-sm">Tồn kho: {totalQuantity}</div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <div className="text-red-600 font-bold">
                      {discountedPrice.toLocaleString()} đ
                    </div>
                    {product.discount > 0 && (
                      <div className="text-sm text-gray-400 line-through">
                        {product.price.toLocaleString()} đ
                      </div>
                    )}
                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => handleEditClick(product._id)}
                      >
                        <FaEdit />
                      </button>
                      <button className="text-gray-600 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={totalPage * PAGE_SIZE}
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[800px] relative flex gap-6">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>

            <div className="w-1/3 flex flex-col gap-4">
              <img
                src={editingProduct.images?.[0] || "https://via.placeholder.com/150"}
                alt={editingProduct.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <button className="bg-gray-100 px-3 py-1 text-sm rounded text-center">
                📁 Chọn hình ảnh
              </button>
              <p className="text-xs text-gray-500">Chọn một hoặc nhiều hình ảnh sản phẩm (URL hoặc tải lên).</p>
            </div>

            <div className="w-2/3 space-y-3">
              <h2 className="text-xl font-bold">Chỉnh sửa sản phẩm</h2>
              <div>
                <label className="block font-semibold mb-1">Tên sản phẩm:</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  placeholder="VD: Áo khoác gió Jogarbola Track Jacket"
                />
                <p className="text-xs text-gray-500 mt-1">Nhập tên sản phẩm rõ ràng, mô tả ngắn gọn.</p>
              </div>
              <div>
                <label className="block font-semibold mb-1">Danh mục:</label>
                <select
                  value={editingProduct.category?._id || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: listCategory.find((c) => c._id === e.target.value),
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Chọn danh mục</option>
                  {listCategory.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Chọn danh mục phù hợp với sản phẩm.</p>
              </div>
              <div>
                <label className="block font-semibold mb-1">Giá bán (VNĐ):</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                  className="w-full border px-3 py-2 rounded"
                  placeholder="VD: 369000"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Nhập giá bán, ví dụ: 369000 VNĐ.</p>
              </div>
              <div>
                <label className="block font-semibold mb-1">Mô tả sản phẩm:</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                  rows="3"
                  placeholder="VD: Chất liệu cao cấp, phù hợp mọi thời tiết"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Mô tả chi tiết sản phẩm, có thể để trống.</p>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold">Chọn màu:</label>
                <div className="flex flex-wrap gap-2">
                  {editingProduct.variants?.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedColorIndex(idx);
                        setSelectedSizeIndex(null);
                      }}
                      className={`px-2 py-1 border rounded text-sm ${selectedColorIndex === idx ? "bg-blue-600 text-white" : "bg-gray-100"
                        }`}
                    >
                      {v.color?.name || v.color}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Chọn màu sắc của sản phẩm.</p>

                {selectedColorIndex !== null && (
                  <>
                    <label className="block font-semibold">Chọn size:</label>
                    <div className="flex flex-wrap gap-2">
                      {editingProduct.variants[selectedColorIndex].sizes.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => setSelectedSizeIndex(sIdx)}
                          className={`px-2 py-1 border rounded text-sm ${selectedSizeIndex === sIdx ? "bg-green-600 text-white" : "bg-gray-100"
                            }`}
                        >
                          {s.size?.name || s.size}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Chọn kích thước cho màu đã chọn.</p>
                  </>
                )}

                {selectedColorIndex !== null && selectedSizeIndex !== null && (
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <label>Số lượng tồn kho:</label>
                    <input
                      type="number"
                      min="0"
                      value={
                        editingProduct.variants[selectedColorIndex].sizes[selectedSizeIndex]
                          .quantity
                      }
                      onChange={(e) => {
                        const newQuantity = Number(e.target.value);
                        setEditingProduct((prev) => {
                          const newVariants = [...prev.variants];
                          newVariants[selectedColorIndex] = {
                            ...newVariants[selectedColorIndex],
                            sizes: newVariants[selectedColorIndex].sizes.map((size, idx) =>
                              idx === selectedSizeIndex
                                ? { ...size, quantity: newQuantity }
                                : size
                            ),
                          };
                          return { ...prev, variants: newVariants };
                        });
                      }}
                      className="border px-2 py-1 rounded w-20"
                      placeholder="VD: 10"
                    />
                    <p className="text-xs text-gray-500 ml-2">Nhập số lượng tồn kho cho size này.</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveChanges}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                💾 Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[800px] relative max-h-[90vh] overflow-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">Thêm sản phẩm mới</h2>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Tên sản phẩm:</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
                placeholder="VD: Áo khoác gió Jogarbola Track Jacket"
              />
              <p className="text-xs text-gray-500 mt-1">Nhập tên sản phẩm rõ ràng, mô tả ngắn gọn.</p>
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Mô tả sản phẩm:</label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
                rows="3"
                placeholder="VD: Chất liệu cao cấp, phù hợp mọi thời tiết"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Mô tả chi tiết sản phẩm, có thể để trống.</p>
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Giá bán (VNĐ):</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, price: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
                placeholder="VD: 369000"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Nhập giá bán, ví dụ: 369000 VNĐ.</p>
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Giảm giá (%):</label>
              <input
                type="number"
                value={newProduct.discount}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, discount: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
                placeholder="VD: 10"
                min="0"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">Nhập phần trăm giảm giá (0-100), để 0 nếu không giảm.</p>
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Danh mục:</label>
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Chọn danh mục</option>
                {listCategory.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Chọn danh mục phù hợp với sản phẩm.</p>
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Hình ảnh (URLs):</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="VD: https://res.cloudinary.com/.../image.jpg"
                />
                <button
                  onClick={addImage}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-2">Dán URL hình ảnh, ví dụ: https://res.cloudinary.com/.../image.jpg</p>
              <div className="space-y-2 max-h-48 overflow-auto border p-2 rounded">
                {newProduct.images.length === 0 && (
                  <p className="text-gray-500">Chưa có hình ảnh nào</p>
                )}
                {newProduct.images.map((img, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      src={img}
                      alt={`Image ${index}`}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/64")}
                    />
                    <span className="text-sm truncate flex-1">{img}</span>
                    <button
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Biến thể:</label>
              <button
                onClick={addNewVariant}
                className="mb-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                + Thêm biến thể mới
              </button>
              <p className="text-xs text-gray-500 mb-2">Thêm các biến thể màu sắc và kích thước của sản phẩm.</p>
              <div className="space-y-2 max-h-48 overflow-auto border p-2 rounded">
                {newProduct.variants.length === 0 && (
                  <p className="text-gray-500">Chưa có biến thể nào</p>
                )}
                {newProduct.variants.map((variant, colorIdx) => (
                  <div key={colorIdx} className="border p-2 rounded">
                    <label className="block font-semibold text-sm mb-1">Màu sắc:</label>
                    <select
                      value={variant.color}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewProduct((prev) => {
                          const newVariants = [...prev.variants];
                          newVariants[colorIdx].color = val;
                          return { ...prev, variants: newVariants };
                        });
                      }}
                      className="w-full border px-2 py-1 rounded mb-2"
                    >
                      <option value="">Chọn màu</option>
                      {listColors.map((color) => (
                        <option key={color._id} value={color._id}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mb-2">Chọn màu sắc cho biến thể này.</p>

                    <div>
                      <label className="block font-semibold text-sm mb-1">Kích thước:</label>
                      <button
                        onClick={() => addNewSizeForVariant(colorIdx)}
                        className="mb-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Thêm size
                      </button>
                      <p className="text-xs text-gray-500 mb-1">Thêm kích thước và số lượng cho màu này.</p>
                      {variant.sizes.length === 0 && (
                        <p className="text-gray-500">Chưa có size nào</p>
                      )}
                      {variant.sizes.map((sizeObj, sizeIdx) => (
                        <div key={sizeIdx} className="flex gap-2 items-center mb-1">
                          <select
                            value={sizeObj.size}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewProduct((prev) => {
                                const newVariants = [...prev.variants];
                                newVariants[colorIdx].sizes[sizeIdx].size = val;
                                return { ...prev, variants: newVariants };
                              });
                            }}
                            className="border px-2 py-1 rounded flex-1"
                          >
                            <option value="">Chọn size</option>
                            {listSizes.map((size) => (
                              <option key={size._id} value={size._id}>
                                {size.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            placeholder="VD: 10"
                            value={sizeObj.quantity}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewProduct((prev) => {
                                const newVariants = [...prev.variants];
                                newVariants[colorIdx].sizes[sizeIdx].quantity = Number(val);
                                return { ...prev, variants: newVariants };
                              });
                            }}
                            className="border px-2 py-1 rounded w-24"
                          />
                        </div>
                      ))}
                      {variant.sizes.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Chọn kích thước và nhập số lượng tồn kho.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdProduct;