/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink, useNavigate, useRouteError } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../config/axios";
import { useAuth } from "../context/AuthContext";

const login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log("data", data);
    try {
      const res = await axiosInstance.post("/users/login", {
        email: data.username,
        password: data.password,
      });

      if (res.data) {
        login(res.data);
        toast.success("Login successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error?.response?.data?.msg);
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="parata-regular text-3xl">Login</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="username"
        {...register("username", { required: true, min: 4 })}
      />
      {/* <input type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/> */}
      {/* <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/> */}
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="password"
        {...register("password", { min: 4 })}
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        <NavLink to={"/signup"} className="cursor-pointer">
          SignUp Here
        </NavLink>
      </div>
      <button
        type="submit"
        className="bg-black text-white font-light px-8 py-2 mt-4"
      >
        Login
      </button>
    </form>
  );
};

export default login;
