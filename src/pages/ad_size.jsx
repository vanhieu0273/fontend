import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { FaTrash, FaEdit } from "react-icons/fa";

const AdSize = () => {
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const fetchSizes = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/size/list-size");
            setSizes(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách size:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa size này?")) return;
        try {
            await axiosInstance.delete(`/size/delete-size/${id}`);
            setSizes((prev) => prev.filter((size) => size._id !== id));
        } catch (err) {
            console.error("Lỗi khi xóa size:", err);
            alert("Xóa size thất bại.");
        }
    };

    const openForm = (size = null) => {
        setEditData(size);
        setFormData({
            name: size?.name || "",
            description: size?.description || "",
        });
        setShowForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await axiosInstance.put(`/size/update-size/${editData._id}`, formData);
            } else {
                await axiosInstance.post(`/size/create-size`, formData);
            }
            setShowForm(false);
            fetchSizes();
        } catch (err) {
            console.error("Lỗi khi lưu size:", err);
            alert("Lưu size thất bại.");
        }
    };

    return (
        <div className="p-4 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách size</h2>
                <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => openForm(null)}
                >
                    + Thêm size
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 border">TÊN SIZE</th>
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
                        ) : sizes.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4">
                                    Không có size nào
                                </td>
                            </tr>
                        ) : (
                            sizes.map((size) => (
                                <tr key={size._id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{size.name}</td>
                                    <td className="px-4 py-2 border">{size.description}</td>
                                    <td className="px-4 py-2 border">{formatDate(size.createdAt)}</td>
                                    <td className="px-4 py-2 flex gap-4">
                                        <button
                                            className="text-gray-500 hover:text-blue-800"
                                            onClick={() => openForm(size)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="text-gray-500 hover:text-red-800"
                                            onClick={() => handleDelete(size._id)}
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

            {showForm && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[600px] relative max-h-[90vh] overflow-auto shadow-lg">
                        <button
                            onClick={() => setShowForm(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-black"
                            aria-label="Đóng"
                        >
                            ✖
                        </button>

                        <h3 className="text-xl font-bold mb-6">
                            {editData ? "Chỉnh sửa size" : "Thêm size"}
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div>
                                <label className="block font-semibold mb-1">Tên size:</label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: M, L, XL"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Mô tả:</label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="VD: Medium, Large..."
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

export default AdSize;