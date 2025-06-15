import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor thêm token (nếu cần)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi phản hồi (tuỳ chọn)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Token hết hạn hoặc không hợp lệ');
      // có thể redirect hoặc xóa token
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
