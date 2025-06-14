import React from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../config/axios";

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      const res = await axiosInstance.post("/users/register", {
        p_userName: data.username,
        p_fullName: data.fullname,
        p_email: data.email,
        p_phoneNumber: data.phone,
        p_password: data.password,
      });

      if (res.data) {
        toast.success("Signup successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
      toast.error(error?.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="parata-regular text-3xl">Đăng Ký</p>
      </div>

      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Username"
        {...register("username", { required: true, minLength: 4 })}
      />
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Full Name"
        {...register("fullname", { required: true })}
      />
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Phone Number"
        {...register("phone", { required: true })}
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        {...register("password", { required: true, minLength: 4 })}
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <NavLink to={"/login"} className="cursor-pointer text-blue-500 hover:underline">
          Đăng Nhập
        </NavLink>
      </div>

      <button
        type="submit"
        className="bg-black text-white font-light px-8 py-2 mt-4"
      >
        Đăng Ký
      </button>
    </form>
  );
};

export default Signup;
