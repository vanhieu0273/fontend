// /* eslint-disable react-hooks/rules-of-hooks */
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, NavLink, useNavigate, useRouteError } from "react-router-dom";
// import { toast } from "react-toastify";
// import axiosInstance from "../config/axios";
// import { useAuth } from "../context/AuthContext";

// const login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [loading, setLoading] = useState(false);


//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.post("/users/login", {
//         p_userName: data.username,
//         p_password: data.password,
//       });

//       if (res.data) {
//         login(res.data);
//         toast.success("Đăng nhập thành công");
//         navigate("/");
//       }
//     } catch (error) {
//       console.log(error?.response?.data?.msg);
//       toast.error(error?.response?.data?.msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="parata-regular text-3xl">Đăng Nhập</p>
//       </div>
//       <input
//         type="text"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="username"
//         {...register("username", { required: true, min: 4 })}
//       />
//       <input
//         type="password"
//         className="w-full px-3 py-2 border border-gray-800"
//         placeholder="password"
//         {...register("password", { min: 4 })}
//       />

//       <div className="w-full flex justify-between text-sm mt-[-8px]">
//         <NavLink to="/forgot-password" className="cursor-pointer text-blue-500 hover:underline">
//           Quên Mật Khẩu
//         </NavLink>
//         <NavLink to="/signup" className="cursor-pointer text-blue-500 hover:underline">
//           Đăng Ký Tài Khoản
//         </NavLink>
//         {/* <NavLink to={"/signup"} className="cursor-pointer">
//           SignUp Here
//         </NavLink> */}
//       </div>
//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-black text-white font-light px-8 py-2 mt-4"
//       >
//         Đăng Nhập
//       </button>
//     </form>
//   );
// };

// export default login;


/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../config/axios";
import { useAuth } from "../context/AuthContext";

const login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth(); // Lấy user từ context
  const [loading, setLoading] = useState(false);

  // Nếu đã đăng nhập thì chuyển hướng về trang chủ
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/login", {
        p_userName: data.username,
        p_password: data.password,
      });

      if (res.data) {
        login(res.data);
        toast.success("Đăng nhập thành công");
        navigate("/");
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
      toast.error(error?.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="parata-regular text-3xl">Đăng Nhập</p>
      </div>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="username"
        {...register("username", { required: true, minLength: 4 })}
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="password"
        {...register("password", { minLength: 4 })}
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <NavLink to="/forgot-password" className="cursor-pointer text-blue-500 hover:underline">
          Quên Mật Khẩu
        </NavLink>
        <NavLink to="/signup" className="cursor-pointer text-blue-500 hover:underline">
          Đăng Ký Tài Khoản
        </NavLink>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white font-light px-8 py-2 mt-4"
      >
        Đăng Nhập
      </button>
    </form>
  );
};

export default login;