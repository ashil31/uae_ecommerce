
import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { calculateTotals, fetchCart, removeItem, toggleCart, updateItemQuantity } from '../../store/slices/cartSlice'; 
import { ImageUrl } from '../../services/url';
import toast from 'react-hot-toast';


const CartSidebar = React.memo(() => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { items, total, totalItems, isOpen } = useSelector(
    (state) => state.cart,
    shallowEqual
  );
  const { isRTL } = useSelector((state) => state.ui, shallowEqual);

  useEffect(() => {
    dispatch(fetchCart()).then(() => dispatch(calculateTotals()));
    // Optionally debounce if cart updates are very frequent
  }, [dispatch]);

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
    }
    dispatch(updateItemQuantity({ itemId, quantity: newQuantity }));
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => dispatch(toggleCart())}
          />
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: isRTL ? -400 : 400 }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? -400 : 400 }}
            transition={{ type: 'tween', duration: 0.1 }}
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full sm:w-96 max-w-full bg-[#f7f5f1] shadow-2xl z-50 flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b">
              <h2 className="text-base sm:text-lg font-semibold flex items-center">
                <FiShoppingBag className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                {t('cart.title')} ({totalItems})
              </h2>
              <button
                onClick={() => dispatch(toggleCart())}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {Array.isArray(items) && items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <FiShoppingBag size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
                  <Link
                    to="/shop"
                    onClick={() => dispatch(toggleCart())}
                    className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
                  >
                    {t('cart.continueShopping')}
                  </Link>
                </div>
              ) : (
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {Array.isArray(items) && items.map((item) => (
                    <div key={item._id} className="flex space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <img
                        src={
                          item?.productId?.images?.[0]?.url
                            ? `${ImageUrl}${item.productId.images[0].url}`
                            : '/images/placeholder-product.jpg'
                        }
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.size && `Size: ${item.size}`}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">
                            {(item.priceAtAddition).toFixed(2)} {t('common.currency')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <FiPlus size={12} />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="p-1 hover:bg-red-100 text-red-500 rounded ml-2"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Footer */}
            {Array.isArray(items) && items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>{t('cart.total')}</span>
                  <span>{total.toFixed(2)} {t('common.currency')}</span>
                </div>
                
                <div className="space-y-3">
                  <Link
                    to="/cart"
                    onClick={() => dispatch(toggleCart())}
                    className="block w-full text-center border border-black text-black py-3 hover:bg-gray-50 transition-colors"
                  >
                    {t('cart.title')}
                  </Link>
                  
                  <Link
                    to="/checkout"
                    onClick={() => dispatch(toggleCart())}
                    className="block w-full text-center bg-black text-white py-3 hover:bg-gray-800 transition-colors"
                  >
                    {t('cart.checkout')}
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default CartSidebar;
