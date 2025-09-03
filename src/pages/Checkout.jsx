import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/UI/SEO';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import OrderSummary from '../components/Checkout/OrderSummary';
import Breadcrumb from '../components/UI/Breadcrumb';

const Checkout = () => {
  const { t } = useTranslation();
  const { items } = useSelector((state) => state.cart);
  const { isRTL } = useSelector((state) => state.ui);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);



  // Redirect if cart is empty
  if (items.length === 0 && !orderComplete) {
    return <Navigate to="/cart" replace />;
  }

  const handleOrderSuccess = (data) => {
    setOrderData(data);
    setOrderComplete(true);
  };

  const breadcrumbs = [
    { name: t('cart.title'), path: '/cart' },
    { name: t('cart.checkout'), path: '/checkout' }
  ];

  if (orderComplete) {
    return (
      <>
        <Helmet>
          <title>{`${t('cart.orderComplete')} - UAE`}</title>
        </Helmet>

        <div className={`container mx-auto pt-32 bg-[#f7f5f1] px-4 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('cart.orderComplete')}</h1>
              <p className="text-gray-600">{t('cart.orderCompleteMessage')}</p>
            </div>

            {orderData && (
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="font-semibold mb-4">{t('cart.orderDetails')}</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('cart.orderId')}</span>
                    <span className="font-mono">{orderData.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('cart.items')}</span>
                    <span>{orderData.items}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>{t('cart.total')}</span>
                    <span>{orderData.total.toFixed(2)} {t('common.currency')}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/account/orders'}
                className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
              >
                {t('cart.viewOrders')}
              </button>
              <button
                onClick={() => window.location.href = '/shop'}
                className="w-full border border-gray-300 py-3 hover:bg-gray-50 transition-colors"
              >
                {t('cart.continueShopping')}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Checkout | UAE"
        description="Complete your luxury fashion purchase with secure payment and fast delivery options across UAE."
        keywords="checkout, secure payment, luxury fashion delivery UAE"
      />
      
      <div className={`container pt-32 bg-[#f7f5f1] mx-auto px-4 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Breadcrumb customPaths={breadcrumbs} />
        
        <h1 className="text-3xl font-bold mb-8">{t('cart.checkout')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <CheckoutForm onSuccess={handleOrderSuccess} />
          </div>
          
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout