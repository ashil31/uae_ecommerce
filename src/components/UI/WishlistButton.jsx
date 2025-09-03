import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiBookmark } from 'react-icons/fi';
import { addToWishlist, removeFromWishlist, toggleWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const WishlistButton = ({ 
  product, 
  variant = 'heart', // 'heart' or 'bookmark'
  size = 18,
  className = '',
  showToast = true,
  requireAuth = true,
  showText = false
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Normalize product ID - handle both _id and id
  const productId = product._id || product.id;
  const isInWishlist = wishlistItems.some(item => 
    (item._id === productId) || (item.id === productId)
  );

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (requireAuth && !isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      // Normalize product data for wishlist
      const wishlistProduct = {
        _id: productId,
        id: productId,
        name: product.name,
        price: product.additionalInfo?.price || product.price || product.basePrice,
        images: product.images || [{ url: product.image }],
        brand: product.brand,
        category: product.category,
        subCategory: product.subCategory,
        description: product.description,
        additionalInfo: product.additionalInfo,
        addedAt: new Date().toISOString(),
      };

      dispatch(toggleWishlist(wishlistProduct));

      if (showToast) {
        if (isInWishlist) {
          toast.success('Removed from wishlist');
        } else {
          toast.success('Added to wishlist!');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const Icon = variant === 'heart' ? FiHeart : FiBookmark;

  return (
    <motion.button
      onClick={handleWishlistToggle}
      className={`
        relative transition-all duration-200 
        ${showText 
          ? `flex items-center justify-center space-x-2 border-2 ${
              isInWishlist 
                ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' 
                : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-400 hover:text-red-500'
            }`
          : `p-2 rounded-full ${
              isInWishlist 
                ? 'text-red-500 bg-red-50 hover:bg-red-100 border border-red-200' 
                : 'text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 hover:text-red-500'
            }`
        }
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Icon 
        size={size} 
        className={isInWishlist ? 'fill-current' : ''} 
      />
      
      {showText && (
        <span className="font-medium">
          {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
      
      {/* Animated heart effect */}
      {variant === 'heart' && isInWishlist && !showText && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <FiHeart size={size} className="fill-red-500 text-red-500" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default WishlistButton;