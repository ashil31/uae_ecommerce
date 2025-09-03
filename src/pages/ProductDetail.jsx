import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiHeart,
  FiBookmark,
  FiShare2,
  FiMinus,
  FiPlus,
  FiInfo,
} from "react-icons/fi";
import { addToCart } from "../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import WishlistButton from "../components/UI/WishlistButton";
import Breadcrumb from "../components/UI/Breadcrumb";
import SkeletonLoader from "../components/UI/SkeletonLoader";
import toast from "react-hot-toast";
import { fetchProductById } from "../store/slices/productsSlice";
import { clearReviews } from "../store/slices/reviewSlice";
import { ImageUrl } from "../services/url";
import ProductReviews from "../components/Product/ProductReviews";
import { FiStar } from "react-icons/fi";

import Sguide from "../assets/Sguide.webp";
import ProductCustomizationModal from "./ProductCustomizationModal";
import ComboModal from "./ComboModal";
//added
const InputField = ({ label, type = "text", value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      readOnly
      value={value}
      className="mt-1 block w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
    />
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { currentProduct, isLoading, error } = useSelector(
    (state) => state.products
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedMediaType, setSelectedMediaType] = useState("image"); // 'image' or 'video'

  // Added
  const [showSizeGuide, setShowSizeGuide] = useState(false);
 

  const [comboModalOpen, setComboModalOpen] = useState(false);
const [purchaseOption, setPurchaseOption] = useState('combo'); // 'combo' | 'shirt' | 'pant'

  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const handleCustomizationSubmit = (customizationData) => {
    console.log("Customization Submitted:", customizationData);
    // Here you would typically add the customized product to a shopping cart
    // For this demo, we'll just show an alert.
    // NOTE: In a real app, use a custom notification component instead of alert().
    alert(
      `Product added to cart!\n\nCustomizations:\n${JSON.stringify(
        customizationData,
        null,
        2
      )}`
    );
  };
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const tabFadeVariant = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25 },
  };

  useEffect(() => {
    dispatch(fetchProductById(id));
    // Clear reviews when switching products
    dispatch(clearReviews());
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login", { state: { from: window.location.pathname } }); // Redirect to login
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color");
      return;
    }
    dispatch(
      addToCart({
        productId: id,
        quantity,
        color: selectedColor,
        size: selectedSize,
         purchaseOption,
      })
    );
    toast.success(`Added to cart as ${purchaseOption}`);
  };

  // Handle purchase option selection
  const handlePurchaseOptionSelect = (option) => {
    setPurchaseOption(option);
    setComboModalOpen(false);
    toast.success(`Selected: ${option.charAt(0).toUpperCase() + option.slice(1)}`);
  };
 console.log("Purchase Option:", purchaseOption);
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-blue-600 hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Extract data with fallbacks
  const category = currentProduct?.category || "";
  const subcategory = currentProduct?.subCategory || "";
  const sizes = currentProduct?.additionalInfo?.size || [];
  const colors = currentProduct?.additionalInfo?.color || [];
  // Discount logic: prefer discountedPrice (deal), then flatDiscount/percentDiscount, else show base price
  const price =
    currentProduct?.additionalInfo?.price || currentProduct?.basePrice || 0;
  let finalPrice = price;
  let discount = 0;
  let discountLabel = "";
  let isSale = false;

  if (
    currentProduct.discountedPrice &&
    currentProduct.discountedPrice < price
  ) {
    finalPrice = currentProduct.discountedPrice;
    discount = Math.round(((price - finalPrice) / price) * 100);
    discountLabel = `${discount}% OFF`;
    isSale = true;
  } else if (currentProduct.flatDiscount && currentProduct.flatDiscount > 0) {
    finalPrice = Math.max(0, price - currentProduct.flatDiscount);
    discount = Math.round((currentProduct.flatDiscount / price) * 100);
    discountLabel = `AED ${currentProduct.flatDiscount} OFF`;
    isSale = true;
  } else if (
    currentProduct.percentDiscount &&
    currentProduct.percentDiscount > 0
  ) {
    finalPrice = Math.round(price * (1 - currentProduct.percentDiscount / 100));
    discount = currentProduct.percentDiscount;
    discountLabel = `${discount}% OFF`;
    isSale = true;
  }
  const stock = currentProduct?.additionalInfo?.stock || 0;

  const breadcrumbs = [
    { name: t("nav.shop"), path: "/shop" },
    {
      name: category.charAt(0).toUpperCase() + category.slice(1),
      path: `/shop?category=${category}`,
    },
    ...(subcategory
      ? [
          {
            name:
              subcategory.charAt(0).toUpperCase() +
              subcategory.slice(1).replace(/-/g, " "),
            path: `/shop?category=${category}&subcategory=${subcategory}`,
          },
        ]
      : []),
    {
      name: currentProduct.name?.split(" ").slice(0, 2).join(" ") || "", // Show only first two words
      path: `/product/${currentProduct._id}`,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${currentProduct.name} - ${currentProduct.brand} | UAE`}</title>
        <meta name="description" content={currentProduct.description} />
        <meta
          property="og:title"
          content={`${currentProduct.name} - ${currentProduct.brand}`}
        />
        <meta property="og:description" content={currentProduct.description} />
        <meta
          property="og:image"
          content={`${ImageUrl}${currentProduct.images[0]?.url}`}
        />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={price} />
        <meta property="product:price:currency" content="AED" />
      </Helmet>

      <div className="container pt-32 bg-[#f7f5f1] mx-auto px-4 py-8">
        {/* <Breadcrumb customPaths={breadcrumbs} /> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col lg:flex-row gap-12 mt-8"
        >
          {/* Right: Product Media */}
          <div className="flex flex-col lg:flex-row gap-4 lg:w-1/2">
            {/* Thumbnails */}
            <div className="order-2 lg:order-none flex gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto max-h-[80vh] lg:w-24">
              {/* Image thumbnails */}
              {currentProduct.images?.map((image, index) => (
                <button
                  key={`image-${index}`}
                  onClick={() => {
                    setSelectedImage(index);
                    setSelectedMediaType("image");
                  }}
                  className={`w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 ${
                    selectedImage === index && selectedMediaType === "image"
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={`${ImageUrl}${image.url}`}
                    alt={
                      image.altText ||
                      `${currentProduct.name} view ${index + 1}`
                    }
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-product.jpg";
                    }}
                  />
                </button>
              ))}

              {/* Video thumbnail */}
              {currentProduct.video?.url && (
                <button
                  onClick={() => setSelectedMediaType("video")}
                  className={`w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 relative ${
                    selectedMediaType === "video"
                      ? "border-black"
                      : "border-gray-200"
                  }`}
                >
                  <video
                    src={`${ImageUrl}${currentProduct.video.url}`}
                    className="video-thumbnail"
                    autoPlay
                    muted
                    playsInline
                    style={{ outline: "none" }}
                  />
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              )}
            </div>

            {/* Main Product Media */}
            <div className="order-1 lg:order-none lg:w-3/4 h-[75vh] overflow-hidden rounded-lg bg-[#f7f5f1]">
              {selectedMediaType === "video" && currentProduct.video?.url ? (
                <video
                  src={`${ImageUrl}${currentProduct.video.url}`}
                  className="product-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ outline: "none" }}
                  preload="metadata"
                  onError={(e) => {
                    setSelectedMediaType("image");
                    setSelectedImage(0);
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={`${ImageUrl}${currentProduct.images[selectedImage]?.url}`}
                  alt={
                    currentProduct.images[selectedImage]?.altText ||
                    currentProduct.name
                  }
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/images/placeholder-product.jpg";
                  }}
                />
              )}
            </div>
          </div>

          {/* Left: Product Info */}
          <div className="lg:w-1/2 space-y-6">
            <div className="flex justify-between items-start sm:block">
              {/* Product Name */}
              <h1 className="text-lg sm:text-2xl font-medium sm:font-medium mb-2 sm:mb-0">
                {currentProduct.name}
              </h1>

              {/* Price */}
              <div className="text-right sm:text-left">
                {isSale ? (
                  <div className="flex sm:block flex-col sm:flex-row sm:items-center gap-x-3 text-sm sm:text-2xl font-light">
                    <span className="text-red-600 text-lg mx-1">
                      {finalPrice.toFixed(2)} AED
                    </span>
                    <span className="text-gray-500 line-through text-sm sm:text-base">
                      {price} AED
                    </span>
                  </div>
                ) : (
                  <span className="text-sm sm:text-2xl font-medium">
                    {price} AED
                  </span>
                )}
              </div>
            </div>

            {/* Color Text & Swatches (below name on SM) */}
            {colors.length > 0 && (
              <div className="mt-4 sm:mt-2">
                <span className="text-sm font-semibold block mb-1">
                  Color: {selectedColor || "Select a color"}
                </span>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border-2 ${
                        selectedColor === color
                          ? "border-gray-700"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection + Size Guide Link */}
            {sizes.length > 0 && (
              <div className="mt-4 space-y-1">
                <span className="text-sm font-semibold block">Select Size</span>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 text-sm border rounded ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        aria-label={`Select size ${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs text-blue-600 hover:underline ml-2 whitespace-nowrap"
                  >
                    Size Guide
                  </button>
                </div>
           
         
            {/* Purchase Option Selection */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold mt-4">
                  Purchase Option: {purchaseOption.charAt(0).toUpperCase() + purchaseOption.slice(1)}
                </span>
                <button
                  onClick={() => setComboModalOpen(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Change
                </button>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 ">
                    {purchaseOption === 'combo' && 'Complete outfit with savings'}
                    {purchaseOption === 'shirt' && 'Shirt only'}
                    {purchaseOption === 'pant' && 'Pant only'}
                  </span>
                  {purchaseOption === 'combo' && (
                    <span className="text-xs font-semibold text-green-600">
                      Save 20%
                    </span>
                  )}
                </div>
              </div>
            </div>


              </div>
            )}

            <div className="flex flex-col  gap-4 mt-6">
              <div className="flex items-center justify-between w-full">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded ">
                  {/* <h3 className="text-sm font-semibold mb-2">Quantity</h3> */}
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      className="p-2 hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  {/* {stock > 0 && (
                  <span className="text-sm text-gray-600 mt-1 block">{stock} available</span>
                )} */}
                </div>

                {/* Info Button and Modal */}
               <div>
                
                  <button onClick={() => setShowCustomizationModal(true)}
                    className="">
                    {/* <FiInfo size={16} /> */}
                    <h4 className="text-blue-700 hover:underline text-xs ">Customization!</h4>
                  </button>

                  <ProductCustomizationModal
                    isOpen={showCustomizationModal}
                    onClose={() => setShowCustomizationModal(false)}
                    // Pass the product's name as a string
                    productName={currentProduct.name}
                    // Add a function to handle the submission
                    onSubmit={handleCustomizationSubmit}
                  />
                </div>
              </div>
            
              <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Add to Cart Button */}
              <div className="w-full mt-4 sm:w-1/2">
                <button
                  onClick={handleAddToCart}
                  disabled={stock <= 0}
                  className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
              {/* Wishlist Button */}
              <div className="flex w-full lg:w-auto mt-4 sm:w-1/2">
                <WishlistButton
                  product={currentProduct}
                  variant="bookmark"
                  size={20}
                  showText={true}
                  className="w-full py-3 px-6 rounded"
                />
              </div>
              </div>
            </div>
          </div>
        </motion.div>

         {/* Combo Modal */}
        <ComboModal
          isOpen={comboModalOpen}
          onClose={() => setComboModalOpen(false)}
          selectedOption={purchaseOption}
          onSelect={handlePurchaseOptionSelect}
        />

        {/* Size-Guide-Modal */}
        {showSizeGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-[#f7f5f1] w-full max-w-4xl p-6 rounded-lg shadow-lg relative flex flex-col md:flex-row gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSizeGuide(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>

              {/* Left: Size Chart Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={Sguide}
                  alt="Size Chart"
                  className="w-full h-full object-contain rounded"
                />
              </div>

              {/* Right: Size Guide Info */}
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-2xl font-bold">Size Guide</h2>
                <p className="text-sm text-gray-600">
                  Find your perfect fit using the measurements below. If you're
                  between sizes, we recommend sizing up for comfort.
                </p>

                <table className="w-full text-sm text-left border border-gray-200 rounded overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2">Size</th>
                      <th className="p-2">Chest (inches)</th>
                      <th className="p-2">Waist (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "S", chest: "36-38", waist: "28-30" },
                      { label: "M", chest: "38-40", waist: "30-32" },
                      { label: "L", chest: "40-42", waist: "32-34" },
                      { label: "XL", chest: "42-44", waist: "34-36" },
                      { label: "XXL", chest: "44-46", waist: "36-38" },
                    ].map((row) => (
                      <tr key={row.label} className="border-t">
                        <td className="p-2 font-medium">{row.label}</td>
                        <td className="p-2">{row.chest}"</td>
                        <td className="p-2">{row.waist}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p className="text-xs text-gray-500">
                  * All sizes are approximate and may vary slightly depending on
                  the garment.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Added for Discription, Additional Info and review */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex space-x-6 justify-center">
              <button
                className={`py-2 text-sm font-medium ${
                  activeTab === "description"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`py-2 text-sm font-medium ${
                  activeTab === "additional"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("additional")}
              >
                Additional Information
              </button>
              <button
                className={`py-2 text-sm font-medium ${
                  activeTab === "reviews"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Review
              </button>
            </nav>
          </div>

          {/* Tab Content with Animation */}
          <div className="mt-6 min-h-[100px]">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  key="description"
                  variants={tabFadeVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <p className="text-gray-700 text-base leading-relaxed">
                    {currentProduct.description || "No description available."}
                  </p>
                </motion.div>
              )}

              {activeTab === "additional" && (
                <motion.div
                  key="additional"
                  variants={tabFadeVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {currentProduct.materials?.length > 0 ? (
                    <>
                      <h3 className="font-semibold mb-2">Materials</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                        {currentProduct.materials.map((mat, idx) => (
                          <li key={idx}>{mat}</li>
                        ))}
                      </ul>
                      <p className="my-4"></p>
                      <h3 className="font-semibold mb-2">Dimension</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                        {currentProduct.additionalInfo.dimensions
                          ?.split("\n")
                          .map((dimension, idx) => (
                            <li key={idx}>{dimension}</li>
                          ))}
                      </ul>
                      <p className="my-4"></p>
                      <h3 className="font-semibold mb-2">Weight</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                        <li>{currentProduct.additionalInfo.weight}</li>
                      </ul>
                      <p className="my-4"></p>
                      <h3 className="font-semibold mb-2">Care Instructions</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                        {currentProduct.careInstructions
                          ?.split("\n")
                          .map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                      </ul>
                    </>
                  ) : (
                    <p>No additional information available.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  variants={tabFadeVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <ProductReviews productId={id} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
