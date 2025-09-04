// cartSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../../services/url';

// --- Helper: get token from state or localStorage ---
const getAccessToken = (getState) => {
  const state = getState?.();
  const tokenFromState = state?.auth?.accessToken;
  return tokenFromState || localStorage.getItem('accessToken') || null;
};

// --- Helper: axios call with Bearer header ---
const authGet = async (url, getState, config = {}) => {
  const token = getAccessToken(getState);
  return axios.get(url, {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

const authPost = async (url, body, getState, config = {}) => {
  const token = getAccessToken(getState);
  return axios.post(url, body, {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

const authPut = async (url, body, getState, config = {}) => {
  const token = getAccessToken(getState);
  return axios.put(url, body, {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

const authDelete = async (url, getState, config = {}) => {
  const token = getAccessToken(getState);
  return axios.delete(url, {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// ---- Thunks ----
export const mergeCarts = createAsyncThunk(
  'cart/mergeCarts',
  async (localCart, { rejectWithValue, getState }) => {
    try {
      const { data } = await authPost(
        `${serverUrl}/cart/merge`,
        { items: localCart },
        getState
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to merge carts',
        status: error.response?.status,
      });
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { data } = await authGet(`${serverUrl}/cart/getCart`, getState);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch cart',
        status: error.response?.status,
      });
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity, color, size, purchaseOption = 'combo' }, { rejectWithValue, getState }) => {
    try {
      const { data } = await authPost(
        `${serverUrl}/cart/addToCart`,
        { productId, quantity, color, size, purchaseOption },
        getState
      );
      return data;
    } catch (error) {
      if (error.response?.data?.availableStock !== undefined) {
        return rejectWithValue({
          message: error.response?.data?.message,
          availableStock: error.response?.data?.availableStock,
          status: error.response?.status,
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to add item',
        status: error.response?.status,
      });
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ itemId, quantity }, { rejectWithValue, getState }) => {
    try {
      const { data } = await authPut(
        `${serverUrl}/cart/${itemId}`,
        { quantity },
        getState
      );
      return data;
    } catch (error) {
      if (error.response?.data?.availableStock !== undefined) {
        return rejectWithValue({
          message: error.response?.data?.message,
          availableStock: error.response?.data?.availableStock,
          maxAllowed: error.response?.data?.maxAllowed,
          status: error.response?.status,
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to update quantity',
        status: error.response?.status,
      });
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId, { rejectWithValue, getState }) => {
    try {
      const { data } = await authDelete(`${serverUrl}/cart/${itemId}`, getState);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to remove item',
        status: error.response?.status,
      });
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode, { rejectWithValue, getState }) => {
    try {
      const { data } = await authPost(
        `${serverUrl}/cart/apply-coupon`,
        { couponCode },
        getState
      );
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Invalid coupon',
        status: error.response?.status,
      });
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      await authDelete(`${serverUrl}/cart/clearCart`, getState);
      return null;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to clear cart',
        status: error.response?.status,
      });
    }
  }
);

// ---- Slice ----
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
  coupon: null,
};

const calculateItemPrice = (item) => {
  const basePrice = item.priceAtAddition || item.price || 0;
  switch (item.purchaseOption) {
    case 'combo':
      return Math.round(basePrice * 0.8);
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
      const activeCart =
        Array.isArray(state.items) && state.items.length > 0
          ? state.items
          : Array.isArray(state.localCart)
          ? state.localCart
          : [];

      state.subTotal = activeCart.reduce((sum, item) => {
        const itemPrice = calculateItemPrice(item);
        return sum + itemPrice * item.quantity;
      }, 0);

      state.total = activeCart.reduce(
        (sum, item) => sum + (item.priceAtAddition || item.price) * item.quantity,
        0
      );

      state.totalItems = activeCart.reduce((sum, item) => sum + item.quantity, 0);

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
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart?.items || [];
        state.coupon = action.payload.cart?.couponApplied || null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(updateItemQuantity.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(removeItem.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeItem.fulfilled, (state) => {
        state.status = 'succeeded';
        // item id is passed as meta.arg
        const removedItemId = removeItem.fulfilled.match ? null : null; // no-op: server returns full cart on success
        state.isLoading = false;
        state.error = null;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(applyCoupon.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.coupon = action.payload.cart.couponApplied;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
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
        state.isLoading = false;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const {
  toggleCart,
  resetCartError,
  addToLocalCart,
  updateLocalQuantity,
  removeFromLocalCart,
  clearLocalCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
