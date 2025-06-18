import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Pagination } from "antd";

const PAGE_SIZE = 10;

const AdCategory = () => {
  const [allCategories, setAllCategories] = useState([]); // Tất cả danh mục
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = Math.ceil(allCategories.length / PAGE_SIZE);

  // Cắt dữ liệu theo trang hiện tại
  const paginatedData = allCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/category");
      const allData = Array.isArray(res.data.data) ? res.data.data : [];
      setAllCategories(allData);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await axiosInstance.delete(`/category/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi xóa danh mục:", err);
      alert("Xóa danh mục thất bại.");
    }
  };

  const openForm = (category = null) => {
    setEditData(category);
    setFormData({
      name: category?.name || "",
      description: category?.description || "",
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await axiosInstance.put(`/category/${editData._id}`, formData);
      } else {
        await axiosInstance.post(`/category`, formData);
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi khi lưu danh mục:", err);
      alert("Lưu danh mục thất bại.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 relative">
      {/* Nút thêm */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách danh mục</h2>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => openForm(null)}
        >
          + Thêm danh mục
        </button>
      </div>

      {/* Bảng danh mục */}
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">TÊN DANH MỤC</th>
              <th className="px-4 py-2 border">MÔ TẢ</th>
              <th className="px-4 py-2 border">NGÀY TẠO</th>
              <th className="px-4 py-2 border">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Không có danh mục nào
                </td>
              </tr>
            ) : (
              paginatedData.map((category) => (
                <tr key={category._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 border">{category.name}</td>
                  <td className="px-4 py-2 border">
                    {category.description || "Không có mô tả"}
                  </td>
                  <td className="px-4 py-2 border">
                    {category.createdAt ? formatDate(category.createdAt) : "—"}
                  </td>
                  <td className="px-4 py-2 flex gap-4">
                    <button
                      className="text-gray-500 hover:text-blue-800"
                      onClick={() => openForm(category)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-800"
                      onClick={() => handleDelete(category._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          total={allCategories.length}
          pageSize={PAGE_SIZE}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[800px] relative max-h-[90vh] overflow-auto shadow-lg">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              aria-label="Đóng"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-6">
              {editData ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block font-semibold mb-1">Tên danh mục:</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Áo khoác gió"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Mô tả:</label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="VD: Danh mục sản phẩm thời trang"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editData ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdCategory;
