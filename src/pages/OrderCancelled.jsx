import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 flex items-center justify-center px-4 py-16 bg-gray-100">
      <div className="bg-[#f7f5f1] w-full max-w-lg rounded-2xl shadow-lg p-8 sm:p-10">
        <div className="flex justify-center mb-4">
          <XCircle className="text-red-500 h-20 w-20 animate-pulse" />
        </div>
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">Order Cancelled</h2>
        <p className="text-center text-gray-600 mb-4">
          Unfortunately, your payment was not completed and the order has been cancelled.
        </p>
        <p className="text-center text-red-500 font-medium mb-6">
          No charges have been made. You can try again or contact support.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 border mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Order Status</span>
            <span className="text-gray-800 font-semibold">Cancelled</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Next Step</span>
            <span className="text-gray-800 font-semibold">Try Checkout Again</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2" size={18} />
            Return to Home
          </button>
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 text-red-600 font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
            onClick={() => navigate('/checkout')}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelled;
// This component handles the order cancellation scenario, providing feedback to the user