/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axiosInstance from "../config/axios";
import { useNavigate } from "react-router-dom"; // Thêm import này

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Khởi tạo navigate

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (step === 1) {
      // Step 1: Request OTP
      try {
        setLoading(true);
        await axiosInstance.post("/users/forgot-password", {
          p_email: data.email,
        });
        setEmail(data.email);
        toast.success(`Đã Gửi Mã Tới Email: ${data.email}`);
        setStep(2);
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Failed to send OTP.");
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      // Step 2: Reset Password
      try {
        setLoading(true);
        await axiosInstance.post("/users/reset-password", {
          p_email: email,
          otp: data.otp,
          newPassword: data.newPassword,
        });
        toast.success("Password reset successfully. Please login.");
        navigate("/login"); // Chuyển hướng sang trang login
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Failed to reset password.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="parata-regular text-3xl">Lấy Lại Mật Khẩu</p>
      </div>

      {step === 1 && (
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Nhập Email"
          {...register("email", { required: true })}
        />
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Nhập Mã"
            {...register("otp", { required: true })}
          />
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Mật Khẩu Mới"
            {...register("newPassword", {
              required: true,
              minLength: 6,
            })}
          />
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white font-light px-8 py-2 mt-4"
      >
        {step === 1 ? "Gửi" : "Lưu"}
      </button>
    </form>
  );
};

export default ForgotPassword;