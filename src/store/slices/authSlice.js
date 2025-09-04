
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../../api/authAPI';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      
      const response = await authAPI.login({
        email: userData.email,
        password: userData.password,
        uid: userData.uid,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        provider: userData.provider || 'email'
      })

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      
      return response.data;

    } catch (error) {
      // Handle Google/Facebook login errors specifically
      if (error.code && error.code.startsWith('auth/')) {
        return rejectWithValue({ 
          message: error.message, 
          code: error.code 
        });
      }
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Login failed' 
      });
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async(_, { rejectWithValue }) => {
    try {
       const response = await authAPI.refreshToken();
      return response.data;
      
      // Update stored tokens
      // localStorage.setItem('accessToken', response.data.accessToken);
      
      // return response.data;
    } catch (error) {
      // If refresh fails, clear tokens
      localStorage.removeItem('accessToken');
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Token refresh failed' 
      });
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue}) => {
    try {
      await authAPI.logout()
      // Clear stored tokens
      localStorage.removeItem('accessToken');
      
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Logout failed' 
      });
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: error.message || 'Failed to fetch user profile' 
      });
    }
  }
);

export const setAccessTokenAction = (accessToken) => {
  return { type: 'auth/setAccessToken', payload: accessToken };
}

const initialState = {
  user: null,
  accessToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  userType: 'guest',
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Check if token is expired before setting auth state
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp > currentTime) {
            state.accessToken = token;
            state.isAuthenticated = true;
            console.log('✅ Auth initialized with valid token');
          } else {
            // Token is expired, clear it
            localStorage.removeItem('accessToken');
            console.log('🔄 Expired token removed during initialization');
          }
        } catch (error) {
          // Invalid token, clear it
          localStorage.removeItem('accessToken');
          console.log('❌ Invalid token removed during initialization');
        }
      }
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.userType = action.payload.user.role;
        state.error = null;

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
        state.isAuthenticated = false;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
        
        // If refresh token is expired, completely logout the user
        if (action.payload?.shouldLogout) {
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;
          state.userType = 'guest';
          localStorage.removeItem('accessToken');
        }
      })

      // Logged out 
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.userType = 'guest';
        state.error = null;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userType = action.payload.user.role;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
        
        // If profile fetch fails due to auth issues, logout
        if (action.payload?.code === 'TOKEN_EXPIRED' || action.payload?.code === 'TOKEN_INVALID') {
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;
          state.userType = 'guest';
          localStorage.removeItem('accessToken');
        }
      })
      
  },
});

export const { clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
