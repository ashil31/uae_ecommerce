import React, { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle, HandHeart } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { clearCart } from '../store/slices/cartSlice'
import axios from 'axios'
import { serverUrl } from '../services/url'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const OrderConfirmation = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderId, setOrderId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  orderId: newOrder._id,
  // orderStatus: newOrder.status,
  // totalAmount: newOrder.totalAmount

  useEffect(() => {
    const handleOrderConfirmation = async (sessionId) => {
      try {
        const response = await axios.post(`${serverUrl}/payment/checkout-success`, 
          { sessionId }, 
          { withCredentials: true }
        );
        if (response.data.success) {
          setOrderId(response.data.orderId);
          toast.success('Order confirmed successfully!');
        } else {
          toast.error('Failed to confirm order. Please try again later.');
          return;
        }
        await dispatch(clearCart());
      } catch (error) {
        toast.error('Failed to confirm order. Please try again later.');
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (sessionId) {
      handleOrderConfirmation(sessionId);
    } else {
      setIsProcessing(false);
    }
  }, [dispatch]);

  if (isProcessing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 flex items-center justify-center px-4 py-16 bg-gray-100">
      <div className="bg-[#f7f5f1] w-full max-w-lg rounded-2xl shadow-lg p-8 sm:p-10">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-emerald-500 h-20 w-20 animate-pulse" />
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-center text-gray-600 mb-4">
          Thank you for your purchase. Your order is now being processed.
        </p>
        <p className="text-center text-emerald-600 font-medium mb-6">
          Check your email for the order details and updates.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 border mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Order Number</span>
            <span className="text-gray-800 font-semibold">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Estimated Delivery</span>
            <span className="text-gray-800 font-semibold">3-5 Business Days</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            onClick={() => navigate('/')}
          >
            <HandHeart className="mr-2" size={18} />
            Thank You for Shopping!
          </button>
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 text-emerald-600 font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
            <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
