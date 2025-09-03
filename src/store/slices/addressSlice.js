import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userAPI from '../../api/userAPI';

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userAPI.getUserAddresses(userId);
      return response.data.addresses;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to fetch addresses' 
      });
    }
  }
);

export const addAddress = createAsyncThunk(
  'address/addAddress',
  async ({ userId, addressData }, { rejectWithValue }) => {
    try {
      const response = await userAPI.addAddress(userId, addressData);
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to add address' 
      });
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/updateAddress',
  async ({ userId, addressId, addressData }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateAddress(userId, addressId, addressData);
      return response.data.address;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to update address' 
      });
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await userAPI.setDefaultAddress(userId, addressId);
      return { addressId, address: response.data.address };
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to set default address' 
      });
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      await userAPI.deleteAddress(userId, addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to delete address' 
      });
    }
  }
);

const initialState = {
  addresses: [],
  isLoading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAddresses: (state) => {
      state.addresses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // Add address
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses.push(action.payload);
        state.error = null;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        // Set all addresses to non-default
        state.addresses.forEach(addr => {
          addr.isDefault = false;
        });
        // Set the selected address as default
        const index = state.addresses.findIndex(addr => addr._id === action.payload.addressId);
        if (index !== -1) {
          state.addresses[index].isDefault = true;
        }
        state.error = null;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      })

      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearError, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;