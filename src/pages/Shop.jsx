// Updated Shop component with fixed filter query logic
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../components/Product/ProductCard";
import ShopFilters from "../components/Shop/ShopFilters";
import Breadcrumb from "../components/UI/Breadcrumb";
import SkeletonLoader from "../components/UI/SkeletonLoader";
import SEO from "../components/UI/SEO";
import { IoGridOutline, IoGrid } from "react-icons/io5";
import { FaList, FaFilter, FaTh, FaThLarge } from "react-icons/fa";
import { FiSearch, FiX, FiChevronDown, FiRefreshCw, FiEye, FiHeart, FiChevronUp } from "react-icons/fi";
import {
  clearFilters,
  fetchProducts,
  setFilters,
} from "../store/slices/productsSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings2 } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../services/url";

const Shop = () => {
  const { category: rawCategory, subcategory: rawSubcategory } = useParams();
  const category = rawCategory?.toLowerCase() || "";
  const subcategory = rawSubcategory?.toLowerCase() || "";
 
  // For Megamenu filter
  const isSalePage = subcategory === 'sale';
  const isNewArrivalsPage = subcategory === 'new-arrivals';
  const isBestSellersPage = subcategory === 'best-sellers';
  const isSpecialSubcategoryPage = isSalePage || isNewArrivalsPage || isBestSellersPage;

  // State
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsPerPageState, setProductsPerPageState] = useState(12);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { filters, products, isLoading } = useSelector((state) => state.products);
  const { isRTL } = useSelector((state) => state.ui);
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [gridSize, setGridSize] = useState('medium');
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = productsPerPageState;
  const mobileFiltersRef = useRef();
  const desktopFiltersRef = useRef();

  // Filter options state
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    subcategories: [],
    colors: [],
    brands: [],
    sizes: [],
    fabrics: [],
  });

  // Memoized safe filters to prevent unnecessary re-renders
  const safeFilters = useMemo(() => ({
    priceRange: filters?.priceRange || [0, 10000],
    colors: filters?.colors || [],
    sizes: filters?.sizes || [],
    brands: filters?.brands || [],
    fabrics: filters?.fabrics || [],
    category: typeof filters?.category === "string" ? filters.category.toLowerCase() : "",
    subcategory: typeof filters?.subcategory === "string" ? filters.subcategory.toLowerCase() : "",
  }), [filters]);

  // Build query parameters for API call
  const buildQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: productsPerPage,
    };

    // Add search query if present
    if (searchQuery?.trim()) {
      params.search = searchQuery.trim();
    }

    // Add sort parameter
    if (sortBy) {
      params.sort = sortBy;
    }

    // Add category filter
    if (safeFilters.category) {
      params.category = safeFilters.category;
    }

    // Add subcategory filter (only if not a special subcategory page)
    if (safeFilters.subcategory && !isSpecialSubcategoryPage) {
      params.subcategory = safeFilters.subcategory;
    }

    // Handle special subcategory pages
    if (isSpecialSubcategoryPage) {
      if (isSalePage) {
        params.onSale = true;
      } else if (isNewArrivalsPage) {
        params.newArrivals = true;
      } else if (isBestSellersPage) {
        params.bestSellers = true;
      }
    }

    // Add price range filter
    if (safeFilters.priceRange && 
        Array.isArray(safeFilters.priceRange) && 
        safeFilters.priceRange.length === 2 &&
        (safeFilters.priceRange[0] > 0 || safeFilters.priceRange[1] < 10000)) {
      params.priceMin = safeFilters.priceRange[0];
      params.priceMax = safeFilters.priceRange[1];
    }

    // Add array filters (colors, sizes, brands, fabrics)
    if (safeFilters.colors?.length > 0) {
      params.colors = safeFilters.colors.join(",");
    }

    if (safeFilters.sizes?.length > 0) {
      params.sizes = safeFilters.sizes.join(",");
    }

    if (safeFilters.brands?.length > 0) {
      params.brands = safeFilters.brands.join(",");
    }

    if (safeFilters.fabrics?.length > 0) {
      params.fabrics = safeFilters.fabrics.join(",");
    }

    return params;
  }, [
    currentPage, 
    productsPerPage, 
    searchQuery, 
    sortBy, 
    safeFilters,
    isSpecialSubcategoryPage,
    isSalePage,
    isNewArrivalsPage,
    isBestSellersPage
  ]); 

  // Fetch products with debounced search
  const debouncedFetchProducts = useCallback(() => {
    const params = buildQueryParams();
    dispatch(fetchProducts(params));
  }, [buildQueryParams, dispatch]);

  // Effect for fetching products
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedFetchProducts();
    }, searchQuery ? 300 : 0); // Debounce search queries

    return () => clearTimeout(timeoutId);
  }, [debouncedFetchProducts, searchQuery]);

  // Initialize filters based on URL params
  useEffect(() => {
    if (category || subcategory) {
      const initialFilters = {
        priceRange: [0, 10000],
        colors: [],
        sizes: [],
        brands: [],
        fabrics: [],
        category: category || "",
        subcategory: isSpecialSubcategoryPage ? "" : (subcategory || ""),
      };
      
      dispatch(setFilters(initialFilters));
    }
  }, [category, subcategory, dispatch, isSpecialSubcategoryPage]);

  // Set default sort for special pages
  useEffect(() => {
    if (isNewArrivalsPage && sortBy !== 'newest') {
      setSortBy('newest');
    } else if (isBestSellersPage && sortBy !== 'relevance') {
      setSortBy('relevance');
    }
  }, [isBestSellersPage, isNewArrivalsPage, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [safeFilters, searchQuery]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await axios.get(`${serverUrl}/products/filters`);
        const data = res.data;
        setFilterOptions({
          categories: data.categories || [],
          subcategories: data.subcategories || [],
          colors: data.colors || [],
          brands: data.brands || [],
          sizes: data.sizes || [],
          fabrics: data.fabrics || [],
        });
      } catch (err) {
        setFilterOptions({
          categories: [],
          subcategories: [],
          colors: [],
          brands: [],
          sizes: [],
          fabrics: [],
        });
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Get total count from server response
  const totalProducts = useSelector((state) => state.products.total) || 0;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Event handlers
  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
    setSearchQuery("");
    setCurrentPage(1);
    
    // Reset filters in components
    if (mobileFiltersRef.current?.resetFilters) {
      mobileFiltersRef.current.resetFilters();
    }
    if (desktopFiltersRef.current?.resetFilters) {
      desktopFiltersRef.current.resetFilters();
    }

    navigate("/shop");
  }, [dispatch, navigate]);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [totalPages]);

 

  const handleMobileApplyFilters = useCallback(() => {
    if (mobileFiltersRef.current?.applyFilters) {
      mobileFiltersRef.current.applyFilters();
    }
    setFiltersOpen(false);
  }, []);

  const getGridClasses = useCallback(() => {
    if (viewMode === "list") return "grid-cols-1";
    
    switch (gridSize) {
      case "small":
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";
      case "large":
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";
      default: // medium
        return "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";
    }
  }, [viewMode, gridSize]);

  const format = (str) =>
    str
      ? str
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "";

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            document.querySelector('input[type="text"]')?.focus();
            break;
          case 'f':
            e.preventDefault();
            setFiltersOpen(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <SEO
        title="Shop - Luxury Fashion Collections | UAE"
        description="Browse our complete collection of luxury fashion for men and women. Filter by brand, price, color, and size to find your perfect style."
        keywords="shop luxury fashion, men's clothing, women's clothing, designer brands, fashion UAE"
      />
      <div className={`min-h-screen bg-[#f7f5f1] pt-20 lg:pt-24 ${isRTL ? "rtl" : "ltr"}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Title and Stats */}
              <div className="flex-1">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="text-center text-3xl lg:text-4xl font-bold text-gray-900 mb-2 mt-7"
                >
                  {category ? format(category) : t("nav.shop")}
                  {subcategory && (
                    <span className="text-2xl lg:text-3xl text-gray-600 font-normal">
                      {" "} / {format(subcategory)}
                    </span>
                  )}
                </motion.h1>
              </div>
            </div>
            
            {/* Sort and Filter Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 mt-8 mb-4 p-4 bg-[#f7f4f0] border-t border-b">
              {/* Left: Product Count */}
              <div className="hidden text-sm font-medium sm:block text-gray-700">
                Products ({totalProducts})
              </div>
              
              {/* Center: Filter Button */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-m border-gray-300 rounded-lg transition"
              >
                <Settings2 className="w-3 h-3 sm:w-4 sm:h-4" /> 
                {t("shop.filters")}
              </button>

              {/* Right: Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 text-sm"
                >
                  Sort by
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                
                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#f7f4f0] border border-gray-200 rounded-lg shadow-lg z-20">
                    {[
                      { value: "relevance", label: t("shop.relevance") },
                      { value: "newest", label: "Newest First" },
                      { value: "price_low", label: t("shop.priceLowToHigh") },
                      { value: "price_high", label: t("shop.priceHighToLow") },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          sortBy === option.value ? 'bg-gray-100 font-medium' : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>   
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`grid gap-3 sm:gap-4 md:gap-6 ${getGridClasses()}`}
                >
                  {Array.from({ length: productsPerPage }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02, duration: 0.2 }}
                    >
                      <SkeletonLoader className="h-80 rounded-xl" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (!products || products.length === 0) ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-center py-20"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiSearch className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {searchQuery ? "No search results" : t("shop.noProductsFound")}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery 
                        ? `No products found for "${searchQuery}". Try different keywords or browse our categories.`
                        : t("shop.tryAdjustingFilters")
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={handleClearFilters}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 font-medium"
                      >
                        {searchQuery ? "Clear Search" : t("shop.clearAllFilters")}
                      </button>
                      <button
                        onClick={() => navigate("/shop")}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150 font-medium"
                      >
                        Browse All Products
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Products Grid */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`grid gap-3 sm:gap-4 md:gap-6 ${getGridClasses()}`}
                  >
                    <AnimatePresence mode="popLayout">
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id || product._id || `product-${index}`}
                          layout
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ 
                            duration: 0.2,
                            delay: index * 0.02,
                            ease: "easeOut"
                          }}
                          whileHover={{ y: -3, transition: { duration: 0.15 } }}
                          className="group"
                        >
                          <ProductCard 
                            product={product} 
                            layout={viewMode}
                            className="h-full"
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4"
                    >
                      {/* Pagination Info */}
                      <div className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages} ({totalProducts} total products)
                      </div>

                      {/* Pagination Controls */}
                      <nav className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        >
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex gap-1">
                          {(() => {
                            const pages = [];
                            const showPages = 5;
                            let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                            let endPage = Math.min(totalPages, startPage + showPages - 1);
                            
                            if (endPage - startPage < showPages - 1) {
                              startPage = Math.max(1, endPage - showPages + 1);
                            }

                            for (let i = startPage; i <= endPage; i++) {
                              pages.push(
                                <button
                                  key={i}
                                  onClick={() => handlePageChange(i)}
                                  className={`px-3 py-2 text-sm border rounded-lg transition-all duration-150 ${
                                    currentPage === i
                                      ? "bg-blue-500 text-white border-blue-500 shadow-md"
                                      : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                  }`}
                                >
                                  {i}
                                </button>
                              );
                            }
                            return pages;
                          })()}
                        </div>
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Last
                        </button>
                      </nav>
                      
                      {/* Quick Jump */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Go to:</span>
                        <select
                          value={currentPage}
                          onChange={(e) => handlePageChange(Number(e.target.value))}
                          className="px-2 py-1 border bg-[#f1f1f1] border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Array.from({ length: totalPages }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Page {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {filtersOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setFiltersOpen(false)}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                />
                
                {/* Drawer */}
                <div
                
                  className="fixed top-0 right-0 z-50 w-full max-w-sm h-full bg-[#f7f4f0] shadow-2xl flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FaFilter className="w-4 h-4" />
                      Filters
                    </h3>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Filter Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <ShopFilters
                      ref={mobileFiltersRef}
                      isOpen={filtersOpen}
                      onClose={() => setFiltersOpen(false)}
                      filterOptions={filterOptions}
                      resultsCount={totalProducts}
                    />
                  </div>
                  
                  {/* Footer Actions */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearFilters}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleMobileApplyFilters}
                        className="flex-1 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-500">
                      {totalProducts} products match your filters
                    </div>
                  </div>
                </div>
              </>
            )}
          </AnimatePresence>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isRefreshing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-[#f7f5f1] bg-opacity-80 flex items-center justify-center z-50"
              >
                <div className="flex flex-col items-center gap-4">
                  <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="text-gray-600 font-medium">Refreshing products...</p>     
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Shop;
