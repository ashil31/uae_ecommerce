import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiClock, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import Breadcrumb from '../../components/UI/Breadcrumb';
import { fetchOrderById } from '../../store/slices/orderSlice';
import { ImageUrl } from '../../services/url';

const OrderTracking = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedOrder, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const getStatusIcon = (stage) => {
    switch (stage) {
      case 'confirmed': return <FiCheckCircle className="w-6 h-6" />;
      case 'packed': return <FiPackage className="w-6 h-6" />;
      case 'shipped': return <FiTruck className="w-6 h-6" />;
      case 'out-for-delivery': return <FiTruck className="w-6 h-6" />;
      case 'delivered': return <FiMapPin className="w-6 h-6" />;
      default: return <FiClock className="w-6 h-6" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStageIndex = (stage) => {
    const stages = ['confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered'];
    return stages.indexOf(stage);
  };

  const isStageCompleted = (stage, currentTracking) => {
    return currentTracking.some(track => track.stage === stage);
  };

  const getDefaultAddress = (addresses) => {
    return addresses.find(addr => addr.isDefault) || null;
  };

  const breadcrumbs = [
    { name: t('account.myAccount'), path: '/account' },
    { name: t('account.orders'), path: '/account/orders' },
    { name: 'Order Tracking', path: `/account/orders/${orderId}` }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/account/orders')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const allStages = [
    { stage: 'confirmed', label: 'Order Confirmed' },
    { stage: 'packed', label: 'Packed' },
    { stage: 'shipped', label: 'Shipped' },
    { stage: 'out-for-delivery', label: 'Out for Delivery' },
    { stage: 'delivered', label: 'Delivered' }
  ];

  return (
    <>
      <Helmet>
        <title>Order Tracking - UAE</title>
        <meta name="description" content="Track your order status and delivery progress" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb customPaths={breadcrumbs} />
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/account/orders')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Track Your Order</h1>
              <p className="text-gray-600">Order #{selectedOrder.id}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#f7f5f1] border rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Order Status</h3>
                <p className="text-lg font-medium capitalize text-blue-600">{selectedOrder.status}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Date</h3>
                <p className="text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <div>
                {console.log(selectedOrder)}
                <h3 className="font-semibold mb-2">Total Amount</h3>
                <p className="text-lg font-medium">AED {selectedOrder.total}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                {(() => {
                  const defaultAddress = getDefaultAddress(selectedOrder.addresses);
                  if (defaultAddress) {
                    return (
                      <p className="text-sm text-gray-600">
                        {defaultAddress.firstName} {defaultAddress.lastName}<br />
                        {defaultAddress.street}<br />
                        {defaultAddress.city}, {defaultAddress.emirate}
                      </p>
                    );
                  }
                  return <p className="text-sm text-gray-600">No default address</p>;
                })()}
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-[#f7f5f1] border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Order Timeline</h2>
            
            <div className="space-y-6">
              {allStages.map((stageInfo, index) => {
                const trackingInfo = selectedOrder.tracking?.find(track => track.stage === stageInfo.stage);
                const isCompleted = !!trackingInfo;
                const isCurrentStage = selectedOrder.status === stageInfo.stage;
                
                return (
                  <div key={stageInfo.stage} className="flex items-start space-x-4">
                    {/* Timeline line */}
                    {index < allStages.length - 1 && (
                      <div className="absolute ml-6 mt-8 w-0.5 h-12 bg-gray-200"></div>
                    )}
                    
                    {/* Status icon */}
                    <div className={`relative z-10 p-3 rounded-full ${
                      isCompleted 
                        ? 'bg-green-100 text-green-600' 
                        : isCurrentStage 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {getStatusIcon(stageInfo.stage)}
                    </div>
                    
                    {/* Status details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          isCompleted 
                            ? 'text-green-600' 
                            : isCurrentStage 
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`}>
                          {stageInfo.label}
                        </h3>
                        {trackingInfo && (
                          <span className="text-sm text-gray-500">
                            {formatDate(trackingInfo.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      {trackingInfo && (
                        <p className="text-sm text-gray-600 mt-1">
                          {trackingInfo.message}
                        </p>
                      )}
                      
                      {!isCompleted && isCurrentStage && (
                        <p className="text-sm text-blue-600 mt-1">
                          Currently in progress
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-[#f7f5f1] border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Order Items</h2>
            <div className="space-y-4">
              {selectedOrder.products?.map((item, index) => (
                <div key={index} className="flex items-start border-b pb-4 last:border-b-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                    {item.productId?.images?.[0]?.url ? (
                      <img
                        src={`${ImageUrl}${item.productId.images[0].url}`}
                        alt={item.productId.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productId?.name}</h4>
                    <p className="text-gray-600 text-sm mb-1">
                      {item.color ? `Color: ${item.color}` : ''}
                      {item.size ? `, Size: ${item.size}` : ''}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity} × AED {item.price?.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      AED {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;