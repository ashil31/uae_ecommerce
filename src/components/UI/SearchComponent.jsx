import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';

import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productsSlice';
import { ImageUrl } from '../../services/url';

// Component-scoped CSS to hide the scrollbar without affecting global styles
const scrollbarHideStyle = `
  .component-hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .component-hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

const SearchComponent = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Reset the query when the modal opens
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    // Fetch products on every keystroke if the query is long enough
    if (query.length > 2) {
      dispatch(fetchProducts({ search: query }));
    } else {
      // Clear results if the query is too short
      dispatch(fetchProducts({ search: '' }));
    }
  }, [query, dispatch]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // <AnimatePresence>
    <>
      {isOpen && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center p-4 pt-20 sm:pt-24"
          onClick={handleClose}
        >
          <style>{scrollbarHideStyle}</style>

          <div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="bg-white w-full max-w-2xl h-fit max-h-[80vh] rounded-2xl shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Area */}
            <div className="flex items-center p-4 border-b border-gray-200">
              <Search className="text-gray-400 mr-3 flex-shrink-0" size={22} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('nav.search_placeholder', 'Search for products, brands, or categories...')}
                className="w-full text-lg bg-transparent focus:outline-none placeholder-gray-400"
              />
              <button
                onClick={handleClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-4 component-hide-scrollbar">
               {/* <AnimatePresence mode="wait"> */}
                {loading && (
                  <div key="loader" className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                )}

                {!loading && query.length > 2 && products.length === 0 && (
                   <div key="no-results" className="text-center py-8 text-gray-500">
                     <p>No results found for "{query}"</p>
                     <p className="text-sm mt-1">Try searching for something else.</p>
                   </div>
                )}

                {!loading && query.length <= 2 && (
                  <div key="initial" className="text-center py-8 text-gray-400">
                    <p>Start typing to find what you're looking for.</p>
                  </div>
                )}

                {!loading && products.length > 0 && query.length > 2 && (
                  <div
                    key="results"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                      Products ({products.length})
                    </h3>
                    <div className="space-y-1">
                      {products.map((product) => (
                        <div key={product._id} variants={itemVariants}>
                          <Link
                            to={`/product/${product._id}`}
                            onClick={handleClose}
                            className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <img
                              src={`${ImageUrl}${product.images[0]?.url}`}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-md bg-gray-100"
                              onError={(e) => { e.target.src = 'https://placehold.co/56x56/e2e8f0/4a5568?text=N/A'; }}
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.category}</p>
                            </div>
                            <p className="font-bold text-gray-800">{product.additionalInfo?.price} AED</p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
               {/* </AnimatePresence> */}
            </div>
          </div>
        </div>
      )}
    {/* </AnimatePresence> */}
    </>
  );
};

export default SearchComponent;