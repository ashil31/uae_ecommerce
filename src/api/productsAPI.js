
import axiosInstance from './axios';

const productsAPI = {
  getProducts: (params) => axiosInstance.get('/products', { params }),
  getProductById: (id) => axiosInstance.get(`/products/${id}`),
  getCategories: () => axiosInstance.get('/products/categories'),
  getFeaturedProducts: () => axiosInstance.get('/products/featured'),
  getNewArrivals: () => axiosInstance.get('/products/new-arrivals'),
  searchProducts: (query) => axiosInstance.get(`/products/search?q=${query}`),
  getWholesaleProducts: (params) => axiosInstance.get('/wholesale/products', { params }),
};

export default productsAPI;
