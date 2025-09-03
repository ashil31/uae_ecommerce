
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import wishlistSlice from './slices/wishlistSlice';
import productsSlice from './slices/productsSlice';
import userSlice from './slices/userSlice';
import orderSlice from './slices/orderSlice';
import uiSlice from './slices/uiSlice';
import reviewSlice from './slices/reviewSlice';
import addressSlice from './slices/addressSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    user: userSlice,
    order: orderSlice,
    wishlist: wishlistSlice,
    products: productsSlice,
    ui: uiSlice,
    reviews: reviewSlice,
    address: addressSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
