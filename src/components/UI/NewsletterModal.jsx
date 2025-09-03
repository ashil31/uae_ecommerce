
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const NewsletterModal = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show modal after 3 seconds if user hasn't seen it before
    const hasSeenNewsletter = localStorage.getItem('newsletter_shown');
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter_shown', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!');
      setLoading(false);
      handleClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#f7f5f1] rounded-lg max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-48 bg-gradient-to-r from-gray-900 to-black">
              <button
                onClick={handleClose}
                className="absolute top-4 z-50 right-4 p-2 text-white hover:bg-[#f7f5f1]/20 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <FiMail size={48} className="mx-auto mb-4" />
                  <h2 className="text-2xl font-bold">Stay in Style</h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Get 10% Off Your First Order</h3>
                <p className="text-gray-600">
                  Subscribe to our newsletter and be the first to know about new arrivals, 
                  exclusive offers, and fashion trends.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Subscribe & Get 10% Off'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  No thanks, I'll browse at full price
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                By subscribing, you agree to receive marketing emails from UAE. 
                You can unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
