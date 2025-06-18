import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-blue-600">Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý kinh doanh đồ thể thao</p>
        </div>
        <nav className="mt-6 space-y-2 px-4">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Quản lý sản phẩm
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Quản lý danh mục
          </NavLink>
          <NavLink
            to="/admin/colors"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Quản lý màu sắc
          </NavLink>
          <NavLink
            to="/admin/sizes"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Quản lý kích cỡ
          </NavLink>


          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Quản lý đơn hàng
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Quản lý khách hàng
          </NavLink>

          <NavLink
            to="/admin/employees"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Quản Lý Nhân Viên
          </NavLink>
          <NavLink
            to="/admin/statistics"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Thống Kê Bán Hàng
          </NavLink>
          <NavLink
            to="/admin/finance"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Thống kê tài chính
          </NavLink>

          
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Chào mừng bạn đến trang quản trị!</h1>
        <p className="text-gray-600 mb-4">
          Chọn mục bên trái để quản lý sản phẩm, đơn hàng, khách hàng và thống kê doanh thu.
        </p>

        {/* Nơi hiển thị nội dung con (ví dụ: quản lý sản phẩm, v.v.) */}
        <div className="bg-white p-4 rounded-md shadow-sm min-h-[300px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
