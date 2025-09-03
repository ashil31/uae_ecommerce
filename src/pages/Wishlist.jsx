import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/UI/SEO';
import { FiBookmark, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import Breadcrumb from '../components/UI/Breadcrumb';
import toast from 'react-hot-toast';
import { ImageUrl } from '../services/url';
import { use } from 'react';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { items } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.products);
  const { isRTL } = useSelector((state) => state.ui);

  const handleMoveToCart = (product) => {
    const productId = product._id || product.id;
    const existingProduct = products.find(p => p._id === productId || p.id === productId);
    dispatch(addToCart({
      productId: productId,
      size: product.additionalInfo?.size?.[0] || product.sizes?.[0] || 'M', // Default size
      quantity: 1,
      color: existingProduct.additionalInfo?.color?.[0] 
    }));
    dispatch(removeFromWishlist(productId));
    toast.success('Moved to cart');
  };
  
  const handleRemoveItem = (product) => {
    const productId = product._id || product.id;
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const breadcrumbs = [{ name: t('nav.wishlist'), path: '/wishlist' }];

  return (
    <>
      <SEO
        title="My Wishlist | UAE"
        description="View and manage your saved luxury fashion items. Move items to cart or share your wishlist."
        keywords="wishlist, saved items, luxury fashion favorites"
      />
      
      <div className={`container mx-auto pt-32 bg-[#f7f5f1] px-4 py-8 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Breadcrumb customPaths={breadcrumbs} />
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <FiBookmark className="mr-3" />
            {t('nav.wishlist')} ({items.length})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <FiBookmark size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">{t('wishlist.empty')}</h2>
            <p className="text-gray-600 mb-8">{t('wishlist.emptyMessage')}</p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              {t('wishlist.startShopping')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => {
              const productId = product._id || product.id;
              const productPrice = product.additionalInfo?.price || product.price;
              const productImage = product.images?.[0]?.url || product.image;
              
              return (
                <div key={productId} className="group relative">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={productImage ? `${ImageUrl}${productImage}` : '/images/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(product)}
                      className="absolute top-3 right-3 p-2 bg-[#f7f5f1] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Link
                        to={`/product/${productId}`}
                        className="font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        AED {productPrice}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          AED {product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FiShoppingBag size={16} />
                      <span>{t('wishlist.moveToCart')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isAuthenticated && items.length > 0 && (
          <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
            <h3 className="font-semibold mb-2">{t('wishlist.saveProgress')}</h3>
            <p className="text-gray-600 mb-4">{t('wishlist.loginMessage')}</p>
            <Link
              to="/login"
              className="inline-block bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
            >
              {t('auth.login')}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
