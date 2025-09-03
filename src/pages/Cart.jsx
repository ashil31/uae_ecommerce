// Cart.js
import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FiShoppingBag, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import Breadcrumb from '../components/UI/Breadcrumb';
import SEO from '../components/UI/SEO';
import { ImageUrl } from '../services/url';
import toast from 'react-hot-toast';
import { 
  fetchCart,
  updateItemQuantity,
  removeItem,
  addToLocalCart,
  updateLocalQuantity,
  removeFromLocalCart,
  calculateTotals
} from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { 
    items, 
    localCart, 
    total, 
    totalItems, 
    status,
    error,
    isOpen 
  } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isRTL } = useSelector((state) => state.ui);

  // Calculate display values
  const displayItems = isAuthenticated ? items : localCart;
  const displayTotal = isAuthenticated ? total : 
    localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const displayTotalItems = isAuthenticated ? totalItems : 
    localCart.reduce((sum, item) => sum + item.quantity, 0);

  const shippingCost = displayTotal > 500 ? 0 : 25;
  const tax = displayTotal * 0.05;
  const finalTotal = displayTotal + shippingCost + tax;

  useEffect(() => {
    dispatch(calculateTotals());
  }, [items, dispatch]);

  // Fetch cart when authenticated
  useEffect(() => {
    dispatch(fetchCart())
    .then(() => dispatch(calculateTotals()));
  },[dispatch]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error(error.message || error);
    }
  }, [error]);

  const handleUpdateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
    } else {
      if (isAuthenticated) {
        dispatch(updateItemQuantity({ itemId, quantity: newQuantity }));
      } else {
        dispatch(updateLocalQuantity({ cartId: itemId, quantity: newQuantity }));
      }
    }
  }, [dispatch, isAuthenticated, items]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const breadcrumbs = [{ name: t('cart.title'), path: '/cart' }];

  const safeItems = Array.isArray(items) ? items : [];
  if (status === 'loading' && isAuthenticated && safeItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
        <p className="mt-4">{t('cart.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${t('cart.title')} | ${t('brand.name')}`}
        description={t('cart.metaDescription')}
        keywords={t('cart.metaKeywords')}
      />
      
      <div className={`container bg-[#f7f5f1] pt-32 mx-auto px-4 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Breadcrumb customPaths={breadcrumbs} />
        
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <FiShoppingBag className="mr-3" />
          {t('cart.title')} ({displayTotalItems})
        </h1>

        {displayItems.length === 0 ? (
          <div className="text-center py-16">
            <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">{t('cart.empty')}</h2>
            <p className="text-gray-600 mb-8">{t('cart.emptyMessage')}</p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {displayItems.map((item) => {
                  const itemId = isAuthenticated ? item._id : item.cartId;
                  const productId = isAuthenticated ? item.productId?._id : item.id;
                  const productName = isAuthenticated ? item.productId?.name : item.name;
                  const productImage = isAuthenticated ? item.productId?.images[0].url : item.image;
                  const productPrice = isAuthenticated ? item.priceAtAddition : item.price;
                  const isUpdating = status === 'loading' && item._id === itemId;

                  return (
                    <div key={itemId} className="flex space-x-4 p-6 bg-gray-50 rounded-lg">
                      <img
                        src={`${ImageUrl}${productImage}` || '/images/placeholder-product.jpg'}
                        alt={productName}
                        className="w-24 h-24 object-cover rounded"
                        loading="lazy"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link
                              to={`/product/${productId}`}
                              className="font-medium hover:underline"
                            >
                              {productName}
                            </Link>
                            {item.size && (
                              <p className="text-sm text-gray-500">{t('cart.size')}: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="text-sm text-gray-500">{t('cart.color')}: {item.color}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(itemId)}
                            className="p-2 hover:bg-gray-200 rounded text-red-500"
                            aria-label={t('cart.removeItem')}
                            disabled={isUpdating}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold">
                              {(productPrice).toFixed(2)} {t('common.currency')}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => handleUpdateQuantity(itemId, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                aria-label={t('cart.decreaseQuantity')}
                                disabled={isUpdating}
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className={`px-4 py-2 min-w-[3rem] text-center ${isUpdating ? 'opacity-70' : ''}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(itemId, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50"
                                aria-label={t('cart.increaseQuantity')}
                                disabled={isUpdating}
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>
                            
                            <span className="font-semibold min-w-[6rem] text-right">
                              {(productPrice * item.quantity).toFixed(2)} {t('common.currency')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
                <h3 className="text-lg font-semibold mb-4">{t('cart.orderSummary')}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>{displayTotal.toFixed(2)} {t('common.currency')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{t('cart.shipping')}</span>
                    <span>
                      {shippingCost === 0 ? t('common.free') : `${shippingCost} ${t('common.currency')}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{t('cart.tax')} (VAT 5%)</span>
                    <span>{tax.toFixed(2)} {t('common.currency')}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                    <span>{t('cart.total')}</span>
                    <span>{finalTotal.toFixed(2)} {t('common.currency')}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {displayItems.length > 0 && (
                    <>
                      {isAuthenticated ? (
                        <Link
                          to="/checkout"
                          className="block w-full text-center bg-black text-white py-3 hover:bg-gray-800 transition-colors"
                        >
                          {t('cart.checkout')}
                        </Link>
                      ) : (
                        <div className="space-y-3">
                          <Link
                            to="/login?redirect=/checkout"
                            className="block w-full text-center bg-black text-white py-3 hover:bg-gray-800 transition-colors"
                          >
                            {t('auth.loginToCheckout')}
                          </Link>
                          <p className="text-xs text-gray-600 text-center">
                            {t('auth.guestCheckoutNote')}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  
                  <Link
                    to="/shop"
                    className="block w-full text-center border border-gray-300 py-3 hover:bg-gray-50 transition-colors"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                </div>

                {shippingCost > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-blue-800">
                    {t('cart.freeShippingPromo', { amount: (500 - displayTotal).toFixed(2) })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;