
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import SEO from '../components/UI/SEO';

const NotFound = () => {
  const { t } = useTranslation();
  const { isRTL } = useSelector((state) => state.ui);

  return (
    <>
      <SEO
        title="404 - Page Not Found | UAE"
        description="The page you're looking for doesn't exist. Return to UAE's homepage to continue shopping luxury fashion."
        keywords="404, page not found, UAE fashion"
      />

      <div className={`min-h-screen pt-32 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${isRTL ? 'rtl font-arabic' : 'ltr font-akkurat'}`}>
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* 404 Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative">
                <h1 className="text-8xl md:text-9xl font-light text-gray-200 tracking-wider">404</h1>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-900 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">
                Page Not Found
              </h2>
              <p className="text-base md:text-lg text-gray-600 font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                The page you're looking for has moved, been deleted, or doesn't exist. Let's get you back to discovering luxury fashion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
            >
              <Link
                to="/"
                className="inline-block bg-gray-900 text-white px-8 py-4 text-base md:text-lg font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform tracking-wide"
              >
                Go Home
              </Link>
              <Link
                to="/shop"
                className="inline-block border border-gray-900 text-gray-900 px-8 py-4 text-base md:text-lg font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 hover:scale-105 transform tracking-wide"
              >
                Shop Now
              </Link>
            </motion.div>

            {/* Popular categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500 mb-4 font-light tracking-wide">Or explore our popular categories:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/shop/men" className="text-sm text-gray-600 hover:text-gray-900 transition-colors tracking-wide">
                  Men's Fashion
                </Link>
                <Link to="/shop/women" className="text-sm text-gray-600 hover:text-gray-900 transition-colors tracking-wide">
                  Women's Fashion
                </Link>
                <Link to="/shop/new-in" className="text-sm text-gray-600 hover:text-gray-900 transition-colors tracking-wide">
                  New Arrivals
                </Link>
                <Link to="/wishlist" className="text-sm text-gray-600 hover:text-gray-900 transition-colors tracking-wide">
                  Wishlist
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
