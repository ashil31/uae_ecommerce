import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../../services/url';

// Async thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      // Use the correct endpoint for user orders
      const response = await axios.get(`${serverUrl}/orders/my`, {withCredentials: true});
      return response.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch orders' });
    }
  }
);

// Async thunk for fetching a single order
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      // Use the correct endpoint for order by ID
      const response = await axios.get(`${serverUrl}/orders/${orderId}`, {withCredentials: true});
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch order details' });
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null
  },
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
      })
      // Fetch single order
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch order details';
      });
  }
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;