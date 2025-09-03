
import axiosInstance from './axios';

const userAPI = {
  // Address CRUD operations
  getUserAddresses: (userId) => axiosInstance.get(`/user/${userId}/addresses`, {withCredentials: true}),
  addAddress: (userId, addressData) => axiosInstance.post(`/user/${userId}/addresses`, addressData, {withCredentials: true}),
  updateAddress: (userId, addressId, addressData) => axiosInstance.put(`/user/${userId}/addresses/${addressId}`, addressData, {withCredentials: true}),
  setDefaultAddress: (userId, addressId) => axiosInstance.put(`/user/${userId}/addresses/${addressId}/default`, {withCredentials: true}),
  deleteAddress: (userId, addressId) => axiosInstance.delete(`/user/${userId}/addresses/${addressId}`, {withCredentials: true}),

  // User profile
  getUserProfile: () => axiosInstance.get('/user/profile', {withCredentials: true}),
};

export default userAPI;
