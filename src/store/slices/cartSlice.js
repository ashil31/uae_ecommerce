// cartSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../../services/url';


export const mergeCarts = createAsyncThunk(
  'cart/mergeCarts',
  async (localCart, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${serverUrl}/cart/merge`,
        { items: localCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to merge carts');
    }
  }
);

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverUrl}/cart/getCart`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity, color, size, purchaseOption = 'combo' }, { rejectWithValue }) => {
    try {
      console.log(productId, quantity, color, size)
      const response = await axios.post(
        `${serverUrl}/cart/addToCart`,
        { productId, quantity, color, size, purchaseOption },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (error.response?.data?.availableStock !== undefined) {
        return rejectWithValue({
          message: error.response.data.message,
          availableStock: error.response.data.availableStock
        });
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${serverUrl}/cart/${itemId}`,
        { quantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (error.response?.data?.availableStock !== undefined) {
        return rejectWithValue({
          message: error.response.data.message,
          availableStock: error.response.data.availableStock,
          maxAllowed: error.response.data.maxAllowed
        });
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${serverUrl}/cart/${itemId}`,
        { withCredentials: true }
      );
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverUrl}/cart/apply-coupon`,
        { couponCode },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid coupon');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${serverUrl}/cart/clearCart`, {
        withCredentials: true
      });
      console.log(response)
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  items: [],
  localCart: [],
  total: 0,
  subTotal: 0,
  totalItems: 0,
  discount: 0,
  isOpen: false,
  status: 'idle',
  isLoading: false,
  error: null,
  coupon: null
};

// Helper function to calculate price based on purchase option
const calculateItemPrice = (item) => {
  const basePrice = item.priceAtAddition || item.price || 0;
  
  switch (item.purchaseOption) {
    case 'combo':
      // Apply combo discount (e.g., 20% off)
      return Math.round(basePrice * 0.8); // 20% discount
    case 'shirt':
    case 'pant':
      return basePrice;
    default:
      return basePrice;
  }
};
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    resetCartError: (state) => {
      state.error = null;
    },
    calculateTotals: (state) => {
      const activeCart = Array.isArray(state.items) && state.items.length > 0 
      ? state.items 
      : Array.isArray(state.localCart)
      ? state.localCart
      : [];

       // Calculate subtotal with purchase option pricing
      state.subTotal = activeCart.reduce((sum, item) => {
        const itemPrice = calculateItemPrice(item);
        return sum + (itemPrice * item.quantity);
      }, 0);
      
      state.total = state.subTotal;
      
      state.total = activeCart.reduce((sum, item) => 
        sum + ((item.priceAtAddition || item.price) * item.quantity), 0);
      
      state.totalItems = activeCart.reduce((sum, item) => 
        sum + item.quantity, 0);
      
      if (state.coupon) {
        if (state.coupon.discountType === 'percentage') {
          state.discount = (state.total * state.coupon.discountValue) / 100;
        } else {
          state.discount = state.coupon.discountValue;
        }
        state.total = Math.max(0, state.total - state.discount);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart?.items || [];
        state.coupon = action.payload.cart?.couponApplied || null;
        state.isLoading = false
        state.error = null
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.isLoading = false
        state.error = null
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(updateItemQuantity.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true
        state.error = null
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.isLoading = false
        state.error = null
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(removeItem.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true
        state.error = null
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const removedItemId = action.meta.arg;;
        state.items = state.items.filter((item) => item._id !== removedItemId)
        state.isLoading = false
        state.error = null
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(applyCoupon.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true
        state.error = null
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.coupon = action.payload.cart.couponApplied;
        state.isLoading = false
        state.error = null
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
        state.localCart = [];
        state.total = 0;
        state.subTotal = 0;
        state.totalItems = 0;
        state.discount = 0;
        state.coupon = null;
        state.isLoading = false
        state.error = null
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      });
  }
});

export const {
  toggleCart,
  resetCartError,
  addToLocalCart,
  updateLocalQuantity,
  removeFromLocalCart,
  clearLocalCart,
  calculateTotals
} = cartSlice.actions;

export default cartSlice.reducer;