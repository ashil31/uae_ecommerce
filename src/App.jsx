// App.jsx
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { store } from './store/store';

import './api/axios';
import './index.css';
import './i18n/i18n';

import ScrollToTop from './components/UI/ScrollToTop';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { calculateTotals } from './store/slices/cartSlice';
import { initializeAuth, fetchUserProfile } from './store/slices/authSlice';
import tokenService from './services/tokenService';

// Layout Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import CartSidebar from './components/Cart/CartSidebar';
import NewsletterModal from './components/UI/NewsletterModal';
import Lookbook from './pages/Lookbook';
import Home from './pages/Home';

store.dispatch(calculateTotals());

// ✅ Lazy Load All Pages
// const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const OrderCancelled = lazy(() => import('./pages/OrderCancelled'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail'));
const Account = lazy(() => import('./pages/Account/Account'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage'));
const StoreLocator = lazy(() => import('./pages/StoreLocator'));
const ShippingInfo = lazy(() => import('./pages/ShippingInfo'));
const Returns = lazy(() => import('./pages/Returns'));
const FAQ = lazy(() => import('./pages/Faqs'));
const Careers = lazy(() => import('./pages/Careers'));
const Press = lazy(() => import('./pages/Press'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Accessibility = lazy(() => import('./pages/Accessibility'));
const Wholesale = lazy(() => import('./pages/Wholesale'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AppContent = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set language direction
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const initAuth = async () => {
      dispatch(initializeAuth());

      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await dispatch(fetchUserProfile()).unwrap();
        } catch (err) {
          console.warn('User profile fetch failed:', err);
        }
      }

      tokenService.init();
    };

    initAuth();
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-[#f7f5f1]">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              <Route path="/shop/:category/:subcategory" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<OrderConfirmation />} />
              <Route path="/cancel" element={<OrderCancelled />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/account/*" element={<Account />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/size-guide" element={<SizeGuidePage />} />
              <Route path="/store-locator" element={<StoreLocator />} />
              <Route path="/shipping" element={<ShippingInfo />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/careers" element={<Careers />} />
              <Route path='/lookbook' element={<Lookbook />} />
              <Route path="/press" element={<Press />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/wholesale" element={
                // <ProtectedRoute allowedRoles={['wholesaler']}>
                  <Wholesale />
                // </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <CartSidebar />
        <NewsletterModal />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: "#363636", color: "#fff" },
            success: {
              duration: 3000,
              theme: {
                primary: "#4aed88"
              }
            }
          }}
        />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </Provider>
  );
};

export default App;
