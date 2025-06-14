import React, { useEffect, useState } from "react";
import axiosInstance from "../config/axios";
import { FaTrash, FaEdit } from "react-icons/fa";

const AdUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [formData, setFormData] = useState({ fullName: "", email: "", role: "user" });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/users/list-user");
            // Chỉ hiển thị những user có role là "user"
            const filteredUsers = Array.isArray(res.data.data)
                ? res.data.data.filter((user) => user.role === "user")
                : [];
            setUsers(filteredUsers);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách người dùng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
        try {
            await axiosInstance.delete(`/users/delete/${id}`);
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (err) {
            console.error("Lỗi khi xóa người dùng:", err);
            alert("Xóa người dùng thất bại.");
        }
    };

    const openForm = (user) => {
        setEditData(user);
        setFormData({
            fullName: user?.fullName || "",
            email: user?.email || "",
            role: user?.role || "user",
        });
        setShowForm(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/users/update/${editData._id}`, {
                p_fullName: formData.fullName,
                p_emai: formData.email,
                p_role: formData.role,
                user: { _id: editData._id },
            });
            setShowForm(false);
            fetchUsers();
        } catch (err) {
            console.error("Lỗi khi cập nhật người dùng:", err);
            alert("Cập nhật người dùng thất bại.");
        }
    };

    return (
        <div className="p-4 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border bg-white">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2 border">TÊN ĐĂNG NHẬP</th>
                            <th className="px-4 py-2 border">HỌ TÊN</th>
                            <th className="px-4 py-2 border">EMAIL</th>
                            <th className="px-4 py-2 border">SỐ ĐIỆN THOẠI</th>
                            <th className="px-4 py-2 border">NGÀY TẠO</th>
                            <th className="px-4 py-2 border">THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Không có người dùng nào
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{user.userName}</td>
                                    <td className="px-4 py-2 border">{user.fullName}</td>
                                    <td className="px-4 py-2 border">{user.email}</td>
                                    <td className="px-4 py-2 border">{user.phoneNumber}</td>
                                    <td className="px-4 py-2 border">{formatDate(user.createdAt)}</td>
                                    <td className="px-4 py-2 flex gap-4">
                                        <button
                                            className="text-gray-500 hover:text-blue-800"
                                            onClick={() => openForm(user)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="text-gray-500 hover:text-red-800"
                                            onClick={() => handleDelete(user._id)}
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
                            Chỉnh sửa người dùng
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div>
                                <label className="block font-semibold mb-1">Họ tên:</label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Email:</label>
                                <input
                                    type="email"
                                    className="w-full border px-3 py-2 rounded"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Phân quyền:</label>
                                <select
                                    className="w-full border px-3 py-2 rounded"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                >
                                    <option value="user">Người dùng</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
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
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdUser;