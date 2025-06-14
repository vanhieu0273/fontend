import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Pagination } from "antd";

const PAGE_SIZE = 10;

const AdColor = () => {
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ name: "", code: "" });

    // Pagination state (FE only)
    const [currentPage, setCurrentPage] = useState(1);

    // Lấy toàn bộ danh sách màu từ API (không phân trang BE)
    const fetchColors = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/color/list-color");
            setColors(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách màu sắc:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa màu này?")) return;
        try {
            await axiosInstance.delete(`/color/delete-color/${id}`);
            setColors((prev) => prev.filter((color) => color._id !== id));
        } catch (err) {
            console.error("Lỗi khi xóa màu:", err);
            alert("Xóa màu thất bại.");
        }
    };

    const openForm = (color = null) => {
        setEditData(color);
        setFormData({
            name: color?.name || "",
            code: color?.code || "",
        });
        setShowForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await axiosInstance.put(`/color/update-color/${editData._id}`, formData);
            } else {
                await axiosInstance.post(`/color/create-color`, formData);
            }
            setShowForm(false);
            fetchColors();
        } catch (err) {
            console.error("Lỗi khi lưu màu:", err);
            alert("Lưu màu thất bại.");
        }
    };

    // Tính toán phân trang FE
    const totalPage = Math.ceil(colors.length / PAGE_SIZE);
    const pagedColors = colors.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-4 relative">
            {/* Nút thêm */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách màu sắc</h2>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => openForm(null)}
                >
                    + Thêm màu
                </button>
            </div>

            {/* Bảng màu sắc */}
            <div className="overflow-x-auto">
                <table className="min-w-full border bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 border">TÊN MÀU</th>
                            <th className="px-4 py-2 border">MÃ MÀU</th>
                            <th className="px-4 py-2 border">XEM</th>
                            <th className="px-4 py-2 border">NGÀY TẠO</th>
                            <th className="px-4 py-2 border">THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : pagedColors.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    Không có màu nào
                                </td>
                            </tr>
                        ) : (
                            pagedColors.map((color) => (
                                <tr key={color._id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{color.name}</td>
                                    <td className="px-4 py-2 border">{color.code}</td>
                                    <td className="px-4 py-2 border">
                                        <span
                                            className="inline-block w-6 h-6 rounded border"
                                            style={{ backgroundColor: color.code }}
                                            title={color.name}
                                        />
                                    </td>
                                    <td className="px-4 py-2 border">{formatDate(color.createdAt)}</td>
                                    <td className="px-4 py-2 flex gap-4">
                                        <button
                                            className="text-gray-500 hover:text-blue-800"
                                            onClick={() => openForm(color)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="text-gray-500 hover:text-red-800"
                                            onClick={() => handleDelete(color._id)}
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

            {/* Pagination FE */}
            <div className="flex justify-center mt-8">
                <Pagination
                    current={currentPage}
                    total={colors.length}
                    pageSize={PAGE_SIZE}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>

            {/* Form modal */}
            {showForm && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[600px] relative max-h-[90vh] overflow-auto shadow-lg">
                        {/* Nút đóng */}
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                            aria-label="Đóng"
                        >
                            ✖
                        </button>

                        <h3 className="text-xl font-bold mb-6">
                            {editData ? "Chỉnh sửa màu" : "Thêm màu"}
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div>
                                <label className="block font-semibold mb-1">Tên màu:</label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Đen, Đỏ tươi"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Mã màu (hex):</label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="VD: #FF0000"
                                    required
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

export default AdColor;