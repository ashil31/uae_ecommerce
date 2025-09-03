import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userAPI from '../../api/userAPI';

// Async thunks for user addresses
export const fetchUserAddresses = createAsyncThunk(
  'user/fetchUserAddresses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userAPI.get(`/users/${userId}/addresses`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addAddress = createAsyncThunk(
  'user/addAddress',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await userAPI.post(`/users/${userId}/addresses`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ userId, addressId, data }, { rejectWithValue }) => {
    try {
      const response = await userAPI.put(`/users/${userId}/addresses/${addressId}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      await userAPI.delete(`/users/${userId}/addresses/${addressId}`);
      return addressId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk for updating user settings
export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async ({ userId, settings }, { rejectWithValue }) => {
    try {
      const response = await userAPI.patch(`/users/${userId}/settings`, settings);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    addresses: [],
    loading: false,
    error: null,
    settings: {
      language: 'en',
      currency: 'AED',
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      showTrackingInfo: true
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch addresses';
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add address';
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(
          (addr) => addr._id === action.payload._id
        );
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update address';
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (addr) => addr._id !== action.payload
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete address';
      })
      // Settings
      .addCase(updateUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update settings';
      });
  }
});

export default userSlice.reducer;