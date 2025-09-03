import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FiShoppingBag, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiChevronDown, FiChevronUp, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';
import Breadcrumb from '../../components/UI/Breadcrumb';
import { fetchUserOrders } from '../../store/slices/orderSlice';
import { ImageUrl, serverUrl } from '../../services/url';

const Orders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.order);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders(user._id));
    }
  }, [dispatch, user]);

  const getStatusIcon = (status) => {
    const statuses = {
      confirmed: <FiClock className="text-gray-500" />,
      packed: <FiTruck className="text-yellow-500" />,
      shipped: <FiCheckCircle className="text-blue-500" />,
      'out for delivery': <FiXCircle className="text-violet-500" />,
      delivered: <FiCheckCircle className="text-green-500" />,
    };

    return statuses[status] || <FiClock className="text-gray-500" />;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDefaultAddress = (user) => {
    return user?.addresses?.find(addr => addr.isDefault);
  };

  const toggleOrderDetails = (orderId) => {
    const newExpandedOrders = new Set(expandedOrders);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
    }
    setExpandedOrders(newExpandedOrders);
  };

  const filterOrders = (orders) => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === '' || 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || order.status === statusFilter;
      
      const matchesPaymentMethod = paymentMethodFilter === '' || 
        order.paymentMethod === paymentMethodFilter;
      
      const matchesDate = dateFilter === '' || 
        new Date(order.createdAt).toDateString() === new Date(dateFilter).toDateString();
      
      return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentMethodFilter('');
    setDateFilter('');
  };

  const filteredOrders = filterOrders(orders);

  const breadcrumbs = [
    { name: t('account.myAccount'), path: '/account' },
    { name: t('account.orders'), path: '/account/orders' }
  ];

  return (
    <>
      <Helmet>
        <title>{`${t('account.orders')} - UAE`}</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb customPaths={breadcrumbs} />
        
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('account.orders')}</h1>
          
          {/* Search and Filter Section */}
          <div className="bg-[#f7f5f1] p-6 rounded-lg border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {/* Search Input */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID or Payment Method"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#f7f5f1] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border bg-[#f7f5f1] border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              {/* Payment Method Filter */}
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
                className="px-4 py-2 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">All Payment Methods</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
              
              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-[#f7f5f1] border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <FiFilter className="mr-2" />
                Clear
              </button>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-[#f7f5f1] p-6 rounded-lg border text-center">
              <FiShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {orders.length === 0 ? 'No Orders Yet' : 'No Orders Found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {orders.length === 0 
                  ? "You haven't placed any orders yet." 
                  : 'No orders match your current filters.'
                }
              </p>
              {orders.length === 0 ? (
                <a
                  href="/products"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </a>
              ) : (
                <button
                  onClick={clearFilters}
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Show All Orders
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-[#f7f5f1] p-6 rounded-lg border">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="font-medium">Order #{order._id}</h3>
                      <p className="text-gray-600 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className="capitalize font-medium">{order.status}</span>
                      </div>
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors"
                      >
                        <span className="text-sm">Details</span>
                        {expandedOrders.has(order._id) ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Summary */}
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>Items: {order.products.length}</span>
                    <span>Total: AED {order.totalAmount.toFixed(2)}</span>
                    <span>Payment: {order.paymentMethod || 'Not specified'}</span>
                  </div>
                  
                  {/* Expandable Details Section */}
                  {expandedOrders.has(order._id) && (
                    <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h4>
                        {(() => {
                          const defaultAddress = getDefaultAddress(order.userId);
                          if (defaultAddress) {
                            return (
                              <p className="text-sm text-gray-600">
                                {defaultAddress.firstName} {defaultAddress.lastName}<br />
                                {defaultAddress.street}<br />
                                {defaultAddress.city}, {defaultAddress.emirate}<br />
                                {defaultAddress.country} {defaultAddress.postalCode && `- ${defaultAddress.postalCode}`}
                              </p>
                            );
                          }
                          return <p className="text-sm text-gray-600">No default address found</p>;
                        })()}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {order.paymentMethod || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Order Total</h4>
                        <p className="text-lg font-medium">
                          AED {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {order.products.map((item) => (
                        <div key={item._id} className="flex items-start border-b pb-4">
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
                            <h4 className="font-medium">{item.productId.name}</h4>
                            <p className="text-gray-600 text-sm mb-1">
                              {item.color ? `Color: ${item.color}` : ''}
                              {item.size ? `, Size: ${item.size}` : ''}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Qty: {item.quantity} × AED {item.price.toFixed(2)}
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
                    
                      <div className="flex justify-end mt-6">
                        <a
                          href={`/account/orders/${order._id}`}
                          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Track Order
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;