
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FiPackage, FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import Breadcrumb from './Breadcrumb';

const TrackingPage = () => {
  const { t } = useTranslation();
  const [trackingId, setTrackingId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mockOrderData = {
    'LX123456': {
      id: 'LX123456',
      status: 'shipped',
      items: [
        { name: 'Premium Cotton Shirt', quantity: 1, price: 299 },
        { name: 'Leather Belt', quantity: 1, price: 199 }
      ],
      total: 498,
      timeline: [
        { status: 'ordered', date: '2023-12-01', completed: true },
        { status: 'confirmed', date: '2023-12-02', completed: true },
        { status: 'shipped', date: '2023-12-03', completed: true },
        { status: 'delivered', date: '2023-12-05', completed: false }
      ]
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const order = mockOrderData[trackingId.toUpperCase()];
      if (order) {
        setOrderData(order);
      } else {
        setError('Order not found. Please check your tracking ID.');
      }
      setLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ordered': return <FiPackage className="w-6 h-6" />;
      case 'confirmed': return <FiCheckCircle className="w-6 h-6" />;
      case 'shipped': return <FiTruck className="w-6 h-6" />;
      case 'delivered': return <FiMapPin className="w-6 h-6" />;
      default: return <FiPackage className="w-6 h-6" />;
    }
  };

  const breadcrumbs = [{ name: 'Order Tracking', path: '/tracking' }];

  return (
    <>
      <Helmet>
        <title>Order Tracking - UAE</title>
        <meta name="description" content="Track your order status and delivery progress" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb customPaths={breadcrumbs} />
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>
          
          <form onSubmit={handleTrack} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID (e.g., LX123456)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {orderData && (
            <div className="bg-[#f7f5f1] border rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Order #{orderData.id}</h2>
                <p className="text-gray-600">Total: {orderData.total} AED</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Order Timeline</h3>
                  <div className="space-y-4">
                    {orderData.timeline.map((step, index) => (
                      <div key={step.status} className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            step.completed ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                          </p>
                          <p className="text-sm text-gray-500">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Items</h3>
                  <div className="space-y-2">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">{item.price} AED</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrackingPage;
