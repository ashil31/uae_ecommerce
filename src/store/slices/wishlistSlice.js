
import { createSlice } from '@reduxjs/toolkit';
// import toast from 'react-hot-toast';


{/* Removed the toast from the slice */}
const getInitialWishlist = () => {
  try {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
    return [];
  }
};

const initialState = {
  items: getInitialWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;

      const existingItem = state.items.find(item => 
        (item._id === productId) || (item.id === productId)
      );
      
      if (!existingItem) {
        // Normalize the product data and ensure all required fields
        const wishlistItem = {
          ...product,
          _id: productId,
          id: productId,
          addedAt: product.addedAt || new Date().toISOString(),
        };
        state.items.unshift(wishlistItem); // Add to beginning for recent items first
        try {
          localStorage.setItem('wishlist', JSON.stringify(state.items));
        } catch (error) {
          console.error('Error saving wishlist to localStorage:', error);
        }
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;

      const initialLength = state.items.length;
      state.items = state.items.filter(item => 
        (item._id !== productId) && (item.id !== productId)
      );
      
      // Only update localStorage if item was actually removed
      if (state.items.length !== initialLength) {
        try {
          localStorage.setItem('wishlist', JSON.stringify(state.items));
        } catch (error) {
          console.error('Error saving wishlist to localStorage:', error);
        }
      }
    },
    clearWishlist: (state) => {
      state.items = [];
      try {
        localStorage.removeItem('wishlist');
      } catch (error) {
        console.error('Error clearing wishlist from localStorage:', error);
      }
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;
      
      const existingItemIndex = state.items.findIndex(item => 
        (item._id === productId) || (item.id === productId)
      );
      
      if (existingItemIndex >= 0) {
        // Remove from wishlist
        state.items.splice(existingItemIndex, 1);
      } else {
        // Add to wishlist - normalize the data
        const wishlistItem = {
          ...product,
          _id: productId,
          id: productId,
          addedAt: product.addedAt || new Date().toISOString(),
        };
        state.items.unshift(wishlistItem);
      }
      try {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving wishlist to localStorage:', error);
      }
    },
    // New action to sync wishlist with server (for authenticated users)
    syncWishlist: (state, action) => {
      state.items = action.payload.map(item => ({
        ...item,
        _id: item._id || item.id,
        id: item._id || item.id,
      }));
      try {
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error syncing wishlist to localStorage:', error);
      }
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlist,
  syncWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
