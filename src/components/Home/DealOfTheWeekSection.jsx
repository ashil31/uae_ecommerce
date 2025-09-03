import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist } from '../../store/slices/wishlistSlice';
import OptimizedImage from '../UI/OptimizedImage';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ImageUrl, serverUrl } from '../../services/url';

const DealOfTheWeekSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch deal data
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await axios.get(`${serverUrl}/deals/getDeals`);
        if (response.data.success && response.data.deals.length > 0) {
          const activeDeal = response.data.deals[0]; // Assuming the first deal is the active one
          setDeal({
            ...activeDeal,
            product: activeDeal.product || {
              name: 'Unknown Product',
              price: 0,
              images: []
            }
          });
          
          // Calculate time left based on endDate
          calculateTimeLeft(new Date(activeDeal.endDate));
        } else {
          // No active deals found
          setDeal(null);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch deal');
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, []);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (!deal?.product?.images?.length) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === deal.product.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [deal]);

  // Calculate time left until deal ends
  const calculateTimeLeft = (endDate) => {
    const now = new Date();
    const difference = endDate - now;
    
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }
  };

  // Update timer every second
  useEffect(() => {
    if (!deal?.endDate) return;

    const timer = setInterval(() => {
      calculateTimeLeft(new Date(deal.endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [deal]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!deal) return;

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate('/login', { state: { from: window.location.pathname } }); // Redirect to login
      return;
    }
    
    dispatch(addToCart({
      id: deal.product._id,
      name: deal.product.name,
      price: deal.discountedPrice,
      image: deal.product.images[0]?.url || '',
      quantity: 1
    }));
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (!deal) return;
    
    dispatch(addToWishlist({
      id: deal.product._id,
      name: deal.product.name,
      price: deal.discountedPrice,
      originalPrice: deal.product.price,
      images: deal.product.images,
      discount: deal.discount
    }));
    toast.success('Added to wishlist!');
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return <div className="py-16 text-center">Loading deal...</div>;
  }

  // Return null if there's no active deal to hide the component
  if (error || !deal || !deal.product?.images?.length || new Date(deal.endDate) < new Date()) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 tracking-tight">
            Deal of the Week
          </h2>
          <p className="text-white/80 text-sm sm:text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto">
            Limited time offer on selected luxury items
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Product Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-800 relative">
              {deal.product.images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <OptimizedImage
                    src={`${ImageUrl}${image.url}`}
                    alt={deal.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              -{deal.discount}%
            </div>

            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col space-y-1 sm:space-y-2">
              <button
                onClick={handleAddToWishlist}
                className="p-2 bg-[#f7f5f1]/20 backdrop-blur-sm rounded-full hover:bg-[#f7f5f1]/30 transition-colors"
              >
                <FiHeart size={20} />
              </button>
            </div>

            {/* Dots Navigation */}
            {deal.product.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {deal.product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-[#f7f5f1] w-4' 
                        : 'bg-[#f7f5f1]/50 hover:bg-[#f7f5f1]/70'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <p className="text-white/60 text-sm font-medium mb-2">Special Deal</p>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-light mb-3 sm:mb-4 tracking-wide">
                {deal.product.name}
              </h3>
              
              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl lg:text-3xl font-light">
                  AED {(deal.discountedPrice).toFixed(2)}
                </span>
                <span className="text-base sm:text-lg text-white/60 line-through">
                  AED {deal.product.additionalInfo.price}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-[#f7f5f1]/10 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Offer ends in:</h4>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Min', value: timeLeft.minutes },
                  { label: 'Sec', value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="bg-[#f7f5f1]/10 rounded-lg p-2 sm:p-3">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {item.value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-white/60 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center space-x-2 bg-[#f7f5f1] text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base"
              >
                <FiShoppingBag size={18} className="sm:w-5 sm:h-5" />
                <span>Add to Cart</span>
              </button>
              
              <Link
                to={`/product/${deal.product._id}`}
                className="flex-1 text-center border border-white/40 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-[#f7f5f1] hover:text-black transition-all duration-300 font-medium text-sm sm:text-base"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheWeekSection;