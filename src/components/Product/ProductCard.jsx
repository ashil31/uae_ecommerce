import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { FiBookmark, FiEye, FiShoppingBag } from "react-icons/fi";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";
import OptimizedImage from "../UI/OptimizedImage";
import toast from "react-hot-toast";
import ProductQuickView from "./ProductQuickView";
import { ImageUrl } from "../../services/url";
import { useTranslation } from "react-i18next";

const ProductCard = ({ product, layout = "grid" }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const auth = useSelector((state) => state.auth);
  // More resilient auth flag (covers token/user/isAuthenticated)
  const isAuthenticated =
    !!auth?.token || !!auth?.user || auth?.isAuthenticated === true;

  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewLoading, setQuickViewLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const productId = product?.id || product?._id;
  const isInWishlist = wishlistItems.some((item) => item.id === productId);

  // Handle image hover slideshow (safe against missing images)
  useEffect(() => {
    let interval;
    const imgs = product?.images || [];
    if (isHovering && imgs.length > 1) {
      interval = setInterval(() => {
        setHoveredImageIndex((prev) => (prev + 1) % imgs.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isHovering, product?.images?.length]);

  // Determine which image to show (safe)
  const getCurrentImage = () => {
    const imgs = product?.images || [];
    if (!imgs.length) return "";
    if (isHovering && imgs.length > 1) return imgs[1]?.url || imgs[0]?.url || "";
    return imgs[0]?.url || "";
  };

  const sizes = product?.additionalInfo?.size || ["S", "M", "L", "XL"];

  // ---- Add to Cart (trust server; redirect only on 401/unauthorized) ----
  const handleAddToCart = (e) => {
    e.preventDefault();

    (async () => {
      if (!selectedSize) {
        toast.error("Please select a size before adding to cart");
        return;
      }

      try {
        await dispatch(
          addToCart({
            productId: productId,
            size: selectedSize,
            color: product?.additionalInfo?.color?.[0],
            quantity: 1,
          })
        ).unwrap();

        toast.success("Added to cart!");
      } catch (err) {
        const msg = typeof err === "string" ? err : err?.message;
        const text = (msg || "").toLowerCase();

        // If thunk passed status, prefer that
        if (
          err?.status === 401 ||
          text.includes("unauthorized") ||
          text.includes("login") ||
          text.includes("not authenticated")
        ) {
          toast.error("Please login to add items to cart");
          navigate("/login", { state: { from: window.location.pathname } });
          return;
        }

        if (err?.availableStock !== undefined) {
          toast.error(`${msg} (Available: ${err.availableStock})`);
          return;
        }

        toast.error(msg || "Failed to add item");
      }
    })();
  };

  // ---- Discount logic ----
  const originalPrice = product?.additionalInfo?.price ?? 0;
  let finalPrice = originalPrice;
  let isSale = false;
  let discountLabel = "";

  if (product?.discountedPrice && product.discountedPrice < originalPrice) {
    finalPrice = product.discountedPrice;
    isSale = true;
    const percent = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
    discountLabel = `${percent}% OFF`;
  } else if (product?.flatDiscount && product.flatDiscount > 0) {
    finalPrice = Math.max(0, originalPrice - product.flatDiscount);
    isSale = true;
    discountLabel = `${product.flatDiscount} FLAT`;
  } else if (product?.percentDiscount && product.percentDiscount > 0) {
    finalPrice = Math.round(originalPrice * (1 - product.percentDiscount / 100));
    isSale = true;
    discountLabel = `${product.percentDiscount}% OFF`;
  }

  // ---- Wishlist toggle (keeps your auth requirement) ----
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    try {
      if (isInWishlist) {
        dispatch(removeFromWishlist(productId));
        toast.success("Removed from wishlist");
      } else {
        const wishlistItem = {
          id: productId,
          name: product?.name,
          price: product?.additionalInfo?.price,
          image: product?.images?.[0]?.url,
          brand: product?.brand,
          category: product?.category,
          subCategory: product?.subCategory,
          addedAt: new Date().toISOString(),
        };
        dispatch(addToWishlist(wishlistItem));
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Wishlist error:", error);
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
        <span className="text-xs text-gray-500 self-center">+{sizes.length - 3}</span>
      )}
    </div>
  );

  // ---- List layout ----
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
              alt={product?.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onLoad={() => setImageLoaded(true)}
            />
            {product?.isOnSale && <div className="sale-badge text-red-600">Sale</div>}
          </Link>
        </div>

        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-sm">{product?.brand}</p>
            <Link to={`/product/${productId}`} className="text-lg font-medium hover:text-gray-700">
              {product?.name}
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-2 px-4 rounded text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <FiShoppingBag size={16} />
              {t("Add to Cart")}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded border ${
                isInWishlist ? "text-red-500 border-red-500" : "text-gray-500 border-gray-300"
              }`}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FiBookmark size={16} className={isInWishlist ? "fill-current" : ""} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ---- Grid card ----
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
            alt={product?.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Tags */}
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          {isSale && discountLabel && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">{discountLabel}</span>
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
            className={`p-2 rounded-full backdrop-blur-sm shadow ${
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
            <span>{selectedSize ? t("Add to Cart") : t("common.selectSize")}</span>
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <p className="text-gray-500 text-xs mb-1 truncate">{product?.brand}</p>
        <Link
          to={`/product/${productId}`}
          className="block font-medium text-sm sm:text-base mb-2 hover:text-gray-700 line-clamp-2 h-10 sm:h-12"
        >
          {product?.name}
        </Link>

        <div className="flex flex-col items-center gap-1 mb-2">
          <span className="text-base font-medium text-gray-900">
            {t("common.currency")} {Number(finalPrice || 0).toFixed(2)}
          </span>
          {isSale && (
            <span className="text-xs text-gray-500 text-center line-through">
              {t("common.currency")} {Number(originalPrice || 0).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {showQuickView && (
        <ProductQuickView product={product} onClose={() => setShowQuickView(false)} />
      )}
    </motion.div>
  );
};

export default ProductCard;
