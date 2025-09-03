import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { color, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart,FiBookmark, FiEye, FiShoppingBag } from "react-icons/fi";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";
import OptimizedImage from "../UI/OptimizedImage";
import toast from "react-hot-toast";
import ProductQuickView from "./ProductQuickView";
import { ImageUrl } from "../../services/url";
import RatingStars from "../UI/RatingStars";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, layout = "grid" }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewLoading, setQuickViewLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const productId = product.id || product._id;
  const isInWishlist = wishlistItems.some((item) => item.id === productId);
  const [isHovering, setIsHovering] = useState(false);

  // Handle image hover effect
  useEffect(() => {
    let interval;
    if (isHovering && product.images.length > 1) {
      interval = setInterval(() => {
        setHoveredImageIndex(prev => (prev + 1) % product.images.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isHovering, product.images.length]);

  // Determine which image to show
  const getCurrentImage = () => {
    return isHovering && product.images?.length > 1 
      ? product.images[1].url 
      : product.images[0]?.url;
  };

  const sizes = product.additionalInfo?.size || ["S", "M", "L", "XL"];

  const handleAddToCart = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate('/login', { state: { from: window.location.pathname } }); // Redirect to login
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size before adding to cart");
      return;
    }


    dispatch(addToCart({
        productId: productId,
        size: selectedSize,
        color: product.additionalInfo.color[0],
        quantity: 1,
      })
    );
    toast.success("Added to cart!");
  };

// Discount logic: prefer discountedPrice (deal), then flatDiscount, then percentDiscount, else show base price
const originalPrice = product.additionalInfo?.price;
let finalPrice = originalPrice;
let isSale = false;
let discountLabel = "";

if (product.discountedPrice && product.discountedPrice < originalPrice) {
  finalPrice = product.discountedPrice;
  isSale = true;
  const percent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
  discountLabel = `${percent}% OFF`;
} else if (product.flatDiscount && product.flatDiscount > 0) {
  finalPrice = Math.max(0, originalPrice - product.flatDiscount);
  isSale = true;
  discountLabel = `${product.flatDiscount} FLAT`;
} else if (product.percentDiscount && product.percentDiscount > 0) {
  finalPrice = Math.round(originalPrice * (1 - product.percentDiscount / 100));
  isSale = true;
  discountLabel = `${product.percentDiscount}% OFF`;
}

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();



    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      if (isInWishlist) {
        dispatch(removeFromWishlist(productId));
        toast.success("Removed from wishlist");
      } else {
        const wishlistItem = {
          id: productId,
          name: product.name,
          price: product.additionalInfo?.price,
          image: product.images[0]?.url,
          brand: product.brand,
          category: product.category,
          subCategory: product.subCategory,
          addedAt: new Date().toISOString(),
        };
        dispatch(addToWishlist(wishlistItem));
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error('Wishlist error:', error);
    }
  };

  

  const SizeSelector = () => (
    <div className="flex flex-wrap gap-1 mb-2">
          {sizes.slice(0, 3).map((size) => (
            <button
              key={size}
              onClick={(e) => {
                e.preventDefault();
                setSelectedSize(size);
              }}
              className={`px-2 py-1 text-xs border rounded ${
                selectedSize === size 
                  ? "bg-black text-white border-black" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
          {sizes.length > 3 && (
            <span className="text-xs text-gray-500 self-center">
              +{sizes.length - 3}
            </span>
          )}
        </div>
  );

  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row bg-[#f7f5f1] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="w-full sm:w-48 h-48 sm:h-48 flex-shrink-0 relative overflow-hidden">
          <Link to={`/product/${productId}`}>
            <OptimizedImage
              src={`${ImageUrl}${getCurrentImage()}`}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onLoad={() => setImageLoaded(true)}
            />
             {product.isOnSale && <div className="sale-badge text-red-600">Sale</div>}
          </Link>
        </div>

        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-sm">{product.brand}</p>
            <Link
              to={`/product/${productId}`}
              className="text-lg font-medium hover:text-gray-700"
            >
              {product.name}
            </Link>

            {/* <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-600 font-light">
                AED {(price).toFixed(2)}
              </span>
              {discount > 0 && (
                <>
                  <span className="line-through text-xs text-gray-500">
                    AED {originalPrice}
                  </span>
                  <span className="text-xs text-red-500 ml-1">
                    {discount}% off
                  </span>
                </>
              )}
            </div> */}


          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-2 px-4 rounded text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <FiShoppingBag size={16} />
             Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded border ${
                isInWishlist
                  ? "text-red-500 border-red-500"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              <FiBookmark
                size={16}
                className={isInWishlist ? "fill-current" : ""}
              />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-[#f7f5f1] overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${productId}`}>
          <OptimizedImage
            src={`${ImageUrl}${getCurrentImage()}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          {/* {product.isNew && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded">
              NEW
            </span>
          )} */}
          {isSale && discountLabel && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              {discountLabel}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWishlistToggle(e);
            }}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow${
              isInWishlist 
                ? "bg-[#f7f5f1]/90 text-red-500 hover:bg-[#f7f5f1]" 
                : "bg-[#f7f5f1]/90 text-gray-700 hover:bg-[#f7f5f1]"
            }`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FiBookmark size={16} className={isInWishlist ? "fill-current" : ""} />
          </button>


          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewLoading(true);
              setTimeout(() => {
                setShowQuickView(true);
                setQuickViewLoading(false);
              }, 100);
            }}
            disabled={quickViewLoading}
            className="p-2 rounded-full bg-[#f7f5f1]/90 text-gray-700 shadow-lg backdrop-blur-sm hover:bg-[#f7f5f1] hover:scale-110 transition-all duration-200 disabled:opacity-50"
            title="Quick view"
          >
            {quickViewLoading ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiEye size={16} />
            )}
          </button>
        </div>
        
        {/* Quick Add to Cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!selectedSize) {
                setShowQuickView(true);
                return;
              }
              handleAddToCart(e);
            }}
            className="hidden sm:flex w-full bg-black/90 backdrop-blur-sm text-white py-2.5 px-3 rounded-lg text-sm font-medium items-center justify-center gap-2 hover:bg-black hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <FiShoppingBag size={14} />
            <span>{selectedSize ? t('Add to Cart') : t('common.selectSize')}</span>
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-gray-500 text-xs mb-1 truncate">{product.brand}</p>
        <Link
          to={`/product/${productId}`}
          className="block font-medium text-sm sm:text-base mb-2 hover:text-gray-700 line-clamp-2 h-10 sm:h-12"
        >
          {product.name}
        </Link>


         <div className="flex flex-col items-center gap-1 mb-2">
          <span className="text-base font-medium text-gray-900">
            {t('common.currency')} {finalPrice.toFixed(2)}
          </span>
          {isSale && (
            <span className="text-xs text-gray-500 text-center line-through">
              {t('common.currency')} {originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* <ColorOptions /> */}

        {/* {product.rating && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={Math.floor(product)} />
            <span className="text-xs text-gray-600">
              ({product.reviewCount})
            </span>
          </div>
        )} */}
        {/* <div className="flex items-center gap-2 mb-2">
          <StarRating rating={Math.floor(product.rating)} />
          <RatingStars />
          <span className="text-xs text-gray-600">
            ({product.reviewCount || 2000 })
          </span>
        </div> */}

        {/* <SizeSelector /> */}

        {/* <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-medium">
            {t('common.currency')} {(price).toFixed(2)}
          </span>
          {discount > 0 && (
            <>
              <span className="line-through text-xs text-gray-500">
                {originalPrice}
              </span>
              <span className="text-xs text-red-500 ml-1">
                {discount}% off
              </span>
            </>
          )}
        </div> */}

      </div>


      {showQuickView && (
        <ProductQuickView
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </motion.div>
  );
};

export default ProductCard;