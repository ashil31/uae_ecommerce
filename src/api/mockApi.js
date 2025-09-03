
import axios from 'axios';
import { mockProducts, mockCategories, mockLookbook, mockReviews, mockBanners } from '../data/mockData';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Mock API responses
export const mockApi = {
  // Products
  getProducts: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    let filteredProducts = [...mockProducts];
    
    if (params.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }
    
    if (params.search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    return {
      data: {
        products: filteredProducts,
        total: filteredProducts.length,
        page: params.page || 1,
        totalPages: Math.ceil(filteredProducts.length / (params.limit || 12))
      }
    };
  },

  getProduct: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return { data: product };
  },

  // Categories
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data: mockCategories };
  },

  // Lookbook
  getLookbook: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockLookbook };
  },

  // Reviews
  getReviews: async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const reviews = mockReviews.filter(r => r.productId === parseInt(productId));
    return { data: reviews };
  },

  addReview: async (reviewData) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newReview = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      verified: false
    };
    return { data: newReview };
  },

  // Banners
  getBanners: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data: mockBanners };
  },

  // Newsletter
  subscribeNewsletter: async (email) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: { message: 'Successfully subscribed!' } };
  }
};

export default api;
