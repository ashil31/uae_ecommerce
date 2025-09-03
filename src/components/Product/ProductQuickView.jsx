import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiShoppingBag, FiHeart, FiBookmark, FiMinus, FiPlus, FiZoomIn, FiShare2, FiTruck, FiShield, FiRotateCcw } from "react-icons/fi";
import { ImageUrl } from "../../services/url";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";
import WishlistButton from "../UI/WishlistButton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductQuickView = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize selected color and size with first available option
  useEffect(() => {
    if (product?.additionalInfo?.color?.length > 0 && !selectedColor) {
      setSelectedColor(product.additionalInfo.color[0]);
    }
    if (product?.additionalInfo?.size?.length > 0 && !selectedSize) {
      setSelectedSize(product.additionalInfo.size[0]);
    }
  }, [product, selectedColor, selectedSize]);

  // Handle escape key to close modal and prevent body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
 

  if (!product) return null;

  const handleAddToCart = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (!isAuthenticated) {
        toast.error("Please login to add items to cart");
        navigate('/login', { state: { from: window.location.pathname } });
        return;
      }

      if (!selectedSize && product.additionalInfo?.size?.length > 0) {
        toast.error("Please select a size");
        return;
      }

      if (!selectedColor && product.additionalInfo?.color?.length > 0) {
        toast.error("Please select a color");
        return;
      }

      const productId = product._id || product.id;
      dispatch(
        addToCart({
          productId: productId,
          size: selectedSize,
          color: selectedColor,
          quantity,
        })
      );
      
      toast.success("Added to cart!");
      setIsAnimating(true);
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  }



  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
    setImageLoading(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} from ${product.brand}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const calculateDiscount = () => {
    if (product.basePrice && product.basePrice > product.additionalInfo?.price) {
      const discount = ((product.basePrice - product.additionalInfo.price) / product.basePrice) * 100;
      return Math.round(discount);
    }
    return 0;
  }

  const modalContent = (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-300 ${
        isAnimating ? 'bg-opacity-0' : 'bg-opacity-60'
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-[#f7f5f1] rounded-2xl w-[95%] max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl transform transition-all duration-300 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">Quick View</h2>
            {calculateDiscount() > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {calculateDiscount()}% OFF
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              title="Share product"
            >
              <FiShare2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-colors"
              title="Close"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row overflow-y-auto max-h-[calc(95vh-80px)]">   
          {/* Product Images */}
          <div className="w-full lg:w-1/2 p-6 bg-gray-50">
            <div className="sticky top-0">
              {/* Main Image */}
              <div className="relative mb-4 group">
                <div className="aspect-square bg-[#f7f5f1] rounded-xl overflow-hidden shadow-sm">
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
                  )}
                   <img
                    src={`${ImageUrl}${product.images[selectedImageIndex]?.url || product.images[0]?.url}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                </div>
                <button className="absolute top-3 right-3 p-2 bg-[#f7f5f1] bg-opacity-80 hover:bg-opacity-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <FiZoomIn size={18} />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`aspect-square bg-[#f7f5f1] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "border-black shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={`${ImageUrl}${image.url}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 p-6">
            {/* Product Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-3">{product.brand}</p>

              {/* Rating */}
              {/* <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || 0} reviews)
                </span>
              </div> */}

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  AED {product.additionalInfo?.price}
                </span>
                {product.basePrice && product.basePrice > product.additionalInfo?.price && (
                  <span className="text-xl text-gray-500 line-through">
                    AED {product.basePrice}
                   </span>
                )}
              </div>
            </div>

            {/* Colors */}
            {product.additionalInfo?.color?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-900">
                  Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                </h3>
                <div className="flex gap-3">
                  {product.additionalInfo.color.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color
                          ? "border-black ring-2 ring-black ring-offset-2 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.additionalInfo?.size?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-900">
                  Size: 
                  <span className="font-normal text-gray-600">
                    {selectedSize}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(showAllSizes ? product.additionalInfo.size : product.additionalInfo.size.slice(0, 6)).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-1 border rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {product.additionalInfo.size.length > 6 && (
                    <button
                      onClick={() => setShowAllSizes(!showAllSizes)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      {showAllSizes ? 'Show Less' : `+${product.additionalInfo.size.length - 6} More`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3 text-gray-900">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-lg w-32 bg-[#f7f5f1]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-600 hover:bg-gray-50 transition-colors rounded-l-lg"
                  disabled={quantity <= 1}
                >
                  <FiMinus size={16} />
                </button>
                <span className="flex-1 text-center font-medium py-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-gray-600 hover:bg-gray-50 transition-colors rounded-r-lg"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 active:scale-95"
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiShoppingBag size={20} />
                )}
                {isLoading ? "Adding..." : "Add to Cart"}
              </button>
              <WishlistButton 
                product={product}
                variant="bookmark"
                size={20}
                className="p-4 border rounded-lg"
              />
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center text-center">
                <FiTruck className="text-green-600 mb-2" size={24} />
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <FiShield className="text-blue-600 mb-2" size={24} />
                <span className="text-xs text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <FiRotateCcw className="text-orange-600 mb-2" size={24} />
                <span className="text-xs text-gray-600">Easy Returns</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-gray-900">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>

              {product.materials?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Materials</h3>
                  <p className="text-gray-600 text-sm">
                    {product.materials.join(", ")}
                  </p>
                </div>
              )}

              {product.careInstructions && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900">Care Instructions</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.careInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return createPortal(modalContent, document.body);
};

export default ProductQuickView;