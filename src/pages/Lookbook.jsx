// Premium Lookbook Component - Using Regular Products as Lookbook Display
import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiX, FiChevronLeft, FiChevronRight, FiEye, FiHeart, FiShoppingBag, FiStar, FiShoppingCart } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productsSlice'; // Adjust import path
import OptimizedImage from '../components/UI/OptimizedImage';
import SEO from '../components/UI/SEO';
import Loading from '../components/UI/Loading';
import { ImageUrl } from '../services/url';

const Lookbook = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products, featuredProducts, newArrivals, loading, error } = useSelector((state) => state.products);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Initialize activeCategory from URL parameter or default to 'all'
  const categoryFromUrl = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || 'all');

  // Update activeCategory when URL parameter changes
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
    }
  }, [searchParams, activeCategory]);

  // Fetch data based on active category
  useEffect(() => {
    const fetchData = async () => {
      switch (activeCategory) {
        case 'featured':
          
          break;
        case 'men':
          dispatch(fetchProducts({ category: 'men', limit: 12 }));
          break;
        case 'women':
          dispatch(fetchProducts({ category: 'women', limit: 12 }));
          break;
        case 'accessories':
          dispatch(fetchProducts({ category: 'accessories', limit: 12 }));
          break;
        default: // 'all'
          dispatch(fetchProducts({ limit: 12 }));
          break;
      }
    };

    fetchData();
  }, [activeCategory, dispatch]);

  // Get filtered products based on category
  const getFilteredProducts = () => {
    switch (activeCategory) {
      case 'featured':
        return featuredProducts || [];
      case 'new-arrivals':
        return newArrivals || [];
      case 'men':
        return (products || []).filter(product => 
          product.category?.toLowerCase() === 'men'
        );
      case 'women':
        return (products || []).filter(product => 
          product.category?.toLowerCase() === 'women'
        );
      case 'accessories':
        return (products || []).filter(product => 
          product.category?.toLowerCase() === 'accessories'
        );
      default: // 'all'
        return products || [];
    }
  };

  const filteredProducts = getFilteredProducts();

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedProduct) return;

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedProduct, lightboxIndex]);

  const openLightbox = (product, index) => {
    setSelectedProduct(product);
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (filteredProducts.length === 0) return;
    const newIndex = (lightboxIndex + 1) % filteredProducts.length;
    setLightboxIndex(newIndex);
    setSelectedProduct(filteredProducts[newIndex]);
  };

  const prevImage = () => {
    if (filteredProducts.length === 0) return;
    const newIndex = (lightboxIndex - 1 + filteredProducts.length) % filteredProducts.length;
    setLightboxIndex(newIndex);
    setSelectedProduct(filteredProducts[newIndex]);
  };


  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(price);
  };

  const getProductImage = (product) => {
    if (!product?.images?.[0]?.url) return '/placeholder-image.jpg';
    return `${ImageUrl}${product.images[0].url}`;
  };

  const getProductPrice = (product) => {
    if (product?.isOnSale && product?.discountedPrice) {
      return {
        current: product.discountedPrice,
        original: product.originalPrice || product.additionalInfo?.price,
        isOnSale: true,
        discount: product.discountPercentage || 0
      };
    }
    return {
      current: product?.additionalInfo?.price || product?.basePrice || 0,
      original: null,
      isOnSale: false,
      discount: 0
    };
  };


  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Lookbook - Premium Fashion Collection | UAE"
        description="Explore our curated lookbook featuring the latest fashion trends and premium collections."
        keywords="lookbook, fashion, premium, collection, UAE, style"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 pt-20 lg:pt-32">
        <div className="container mx-auto px-4 py-16">
          
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1 
              className="text-6xl lg:text-8xl font-extralight mb-8 tracking-tight text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('lookbook.title', 'Lookbook')}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '6rem' }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-gray-900 to-transparent mx-auto mb-8"
            />
            <motion.p 
              className="text-gray-600 text-xl font-light max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {t('lookbook.subtitle', 'Discover our curated collection of premium fashion pieces, crafted for the discerning individual')}
            </motion.p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center gap-8 mb-16"
          >
            {['all', 'featured', 'men', 'women', 'accessories'].map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-6 py-3 text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                  activeCategory === category 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t(`lookbook.category.${category}`, category)}
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Premium Product Grid with Lookbook Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {filteredProducts.slice(0, 12).map((product, index) => {
              if (!product) return null;
              const priceInfo = getProductPrice(product);

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredItem(product._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  
                  <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] rounded-3xl mb-6">
                    <OptimizedImage
                      src={getProductImage(product)}
                      alt={product.name || 'Product'}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    
                    {/* Product Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isFeatured && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                          Featured
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium rounded-full">
                          New
                        </span>
                      )}
                      {priceInfo.isOnSale && (
                        <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium rounded-full">
                          -{priceInfo.discount}%
                        </span>
                      )}
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 text-xs font-medium rounded-full">
                        {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Product'}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    {/* <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product._id);
                      }}
                      className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        wishlist.has(product._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiHeart size={16} fill={wishlist.has(product._id) ? 'currentColor' : 'none'} />
                    </motion.button> */}
                    
                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-500 ${
                      hoveredItem === product._id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ 
                            y: hoveredItem === product._id ? 0 : 20, 
                            opacity: hoveredItem === product._id ? 1 : 0 
                          }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                        >
                          {/* Add to Cart Button */}
                          {/* <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="w-full bg-white text-gray-900 py-3 px-4 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiShoppingBag size={16} />
                            Add to Cart - {formatPrice(priceInfo.current)}
                          </motion.button> */}
                          
                          <div className="flex gap-3">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                openLightbox(product, index);
                              }}
                              className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FiEye size={16} />
                              Quick View
                            </motion.button>
                            <Link
                              to={`/product/${product._id}`}
                              className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white py-3 px-4 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiShoppingBag size={16} />
                              View
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-light text-gray-900 tracking-wide line-clamp-2">
                      {product.name || 'Untitled Product'}
                    </h3>
                    <p className="text-sm text-gray-500 font-light line-clamp-1">
                      {product.brand || 'Unknown Brand'}
                    </p>
                    
                    {/* Rating */}
                    {product.averageRating > 0 && (
                      <div className="flex items-center justify-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              size={14}
                              className={i < Math.floor(product.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.totalReviews || 0})
                        </span>
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-medium text-gray-900">
                        {formatPrice(priceInfo.current)}
                      </span>
                      {priceInfo.isOnSale && priceInfo.original && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(priceInfo.original)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-light text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {activeCategory === 'all' 
                  ? 'No products available at the moment' 
                  : `No products found in ${activeCategory} category`
                }
              </p>
            </motion.div>
          )}

          {/* Premium CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-24"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-16 py-5 text-base font-medium tracking-widest uppercase hover:from-gray-800 hover:to-gray-700 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl"
            >
              <span>{t('lookbook.explore_collection', 'Explore Full Collection')}</span>
              <motion.div
                className="w-5 h-5 border-t-2 border-r-2 border-white transform rotate-45"
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Premium Product Lightbox */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >

              {/* Premium Close Button */}
              <motion.button
                onClick={closeLightbox}
                className="absolute top-8 right-8 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX size={24} />
              </motion.button>

              {/* Premium Navigation */}
              {filteredProducts.length > 1 && (
                <>
                  <motion.button
                    onClick={prevImage}
                    className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 border border-white/20"
                    whileHover={{ scale: 1.1, x: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiChevronLeft size={24} />
                  </motion.button>

                  <motion.button
                    onClick={nextImage}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all duration-300 border border-white/20"
                    whileHover={{ scale: 1.1, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiChevronRight size={24} />
                  </motion.button>
                </>
              )}

              {/* Product Image Container */}
              <div className="w-full h-full flex items-center justify-center p-16">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative max-w-4xl max-h-full"
                >
                  <OptimizedImage
                    src={getProductImage(selectedProduct)}
                    alt={selectedProduct.name || 'Product'}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  />
                </motion.div>
              </div>

              {/* Premium Product Info Overlay */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-12 text-white"
              >
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <motion.h3 
                        className="text-4xl font-light mb-2 tracking-wide"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        {selectedProduct.name || 'Untitled Product'}
                      </motion.h3>
                      <motion.p 
                        className="text-lg opacity-90 mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        {selectedProduct.brand || 'Unknown Brand'}
                      </motion.p>
                      <motion.p 
                        className="text-base opacity-80 mb-6 max-w-2xl leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {selectedProduct.description || 'No description available'}
                      </motion.p>
                    </div>
                    
                    {/* Price and Rating */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-right ml-8"
                    >
                      <div className="text-3xl font-light mb-2">
                        {formatPrice(getProductPrice(selectedProduct).current)}
                      </div>
                      {getProductPrice(selectedProduct).isOnSale && (
                        <div className="text-lg opacity-70 line-through">
                          {formatPrice(getProductPrice(selectedProduct).original)}
                        </div>
                      )}
                      {selectedProduct.averageRating > 0 && (
                        <div className="flex items-center justify-end gap-1 mt-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={16}
                                className={i < Math.floor(selectedProduct.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}
                              />
                            ))}
                          </div>
                          <span className="text-sm opacity-70 ml-1">
                            ({selectedProduct.totalReviews || 0})
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex gap-4"
                  >
                    {/* <motion.button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        closeLightbox();
                      }}
                      className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 font-medium tracking-wide hover:bg-gray-100 transition-all duration-300 rounded-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiShoppingCart size={18} />
                      <span>Add to Cart</span>
                    </motion.button> */}
                    
                    <Link
                      to={`/product/${selectedProduct._id}`}
                      className="group inline-flex items-center gap-3 bg-transparent border-2 border-white text-white px-8 py-4 font-medium tracking-wide hover:bg-white hover:text-black transition-all duration-300 rounded-full"
                      onClick={closeLightbox}
                    >
                      <FiShoppingBag size={18} />
                      <span>{t('lookbook.view_product', 'View Product')}</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              {/* Product Counter */}
              <div className="absolute top-8 left-8 z-20 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-light border border-white/20">
                {lightboxIndex + 1} / {filteredProducts.length}
              </div>

              {/* Product Badges */}
              <div className="absolute top-20 left-8 z-20 flex flex-col gap-2">
                {selectedProduct.isFeatured && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
                {selectedProduct.isNew && (
                  <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium rounded-full">
                    New Arrival
                  </span>
                )}
                {getProductPrice(selectedProduct).isOnSale && (
                  <span className="bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium rounded-full">
                    -{getProductPrice(selectedProduct).discount}% OFF
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Lookbook;
