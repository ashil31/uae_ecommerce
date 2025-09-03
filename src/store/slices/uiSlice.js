
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: localStorage.getItem('language') || 'en',
  currency: 'AED',
  isRTL: localStorage.getItem('language') === 'ar',
  mobileMenuOpen: false,
  searchQuery: '',
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      state.isRTL = action.payload === 'ar';
      localStorage.setItem('language', action.payload);
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenu: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen;
    },
  },
});

export const {
  setLanguage,
  toggleMobileMenu,
  setMobileMenu,
  setSearchQuery,
  toggleSearch,
} = uiSlice.actions;

export default uiSlice.reducer;
