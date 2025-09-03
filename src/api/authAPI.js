
import axiosInstance from './axios';


const authAPI = {
  login: (credentials) => axiosInstance.post(`/auth/login`, credentials, {withCredentials:true}),
  register: (userData) => axiosInstance.post(`/auth/register`, userData),
  forgotPassword: (email) => axiosInstance.post(`/auth/forgot-password`, { email }),
  resetPassword: (token, password) => axiosInstance.post(`/auth/reset-password`, { token, password }),
  refreshToken: () => axiosInstance.post(`/auth/refresh`, {}, {withCredentials:true}),
  logout: () => axiosInstance.post(`/auth/logout`, {}, {withCredentials:true}),
  getProfile: () => axiosInstance.get(`/user/profile`, {withCredentials:true}),
};

export default authAPI;
