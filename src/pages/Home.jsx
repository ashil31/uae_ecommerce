import React, { Suspense, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchProducts } from '../store/slices/productsSlice';
import Loading from '../components/UI/Loading';
import SEO from '../components/UI/SEO';
import HeroSlider from '../components/UI/HeroSlider/HeroSlider';
import { ImageUrl } from '../services/url';

// Lazy loading

const DealOfTheWeekSection = React.lazy(() => import('../components/Home/DealOfTheWeekSection'));
// const TopCategories = React.lazy(() => import('../components/Home/TopCategories'));
const NewInSection = React.lazy(() => import('../components/Home/NewInSection'));
const ProductGridSection = React.lazy(() => import('../components/Home/ProductGridSection'));
const OptimizedImage = React.lazy(() => import('../components/UI/OptimizedImage'));
const Home = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isRTL } = useSelector((state) => state.ui);
  const { products, featuredProducts, newArrivals, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Loading/Error States
  if (loading) return <Loading fullScreen />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f4f0]">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const categories = useMemo(() => {
    if (!products?.length) return [];
    return [...new Set(products.map((p) => p.category))]
      .filter(Boolean)
      .slice(0, 2)
      .map((category) => {
        const product = products.find((p) => p.category === category);
        return {
          name: category,
          image: product?.images?.[0]?.url || '',
          href: `/shop/${category}`,
        };
      })
      .filter((c) => c.image);
  }, [products]);

  return (
    <>
      <SEO
        title="UAE - Luxury Fashion for Modern Lifestyle"
        description="Discover premium fashion collections for men and women. Shop luxury clothing, accessories, and more at UAE."
        keywords="luxury fashion, UAE fashion, clothing, men's clothing, women's clothing, accessories"
      />

      <div className={`bg-[#f7f4f0] ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Hero Slider */}
        <HeroSlider />

        {/* Top Categories */}
        <Suspense fallback={<Loading />}>
        {/* <TopCategories /> */}
        </Suspense>

        {categories.length > 0 && (
          <section className="py-16 lg:py-20 bg-[#f7f5f1]">
            <div className="container mx-auto px-4">
              <div
                className="text-center mb-10"
              >
                <h2 className="text-3xl lg:text-5xl font-light text-gray-900 mb-2">
                  {t('home.categories')}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto font-light">
                  {t('home.categoryDescription')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {categories.map((category, index) => (
                  <div
                    key={category.name}
                    
                  >
                    <a
                      href={category.href}
                      className="group relative block h-80 lg:h-[500px] overflow-hidden bg-gray-100 rounded-lg"
                    >
                        <Suspense fallback={<Loading />}>
                      <OptimizedImage
                        src={`${ImageUrl}${category.image}`}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      </Suspense>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                        <div className="p-6 text-white">
                          <h3 className="text-xl lg:text-4xl font-light">
                            {t(`categories.${category.name}`)}
                          </h3>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

       <Suspense fallback={<Loading />}>
        <NewInSection products={newArrivals} />
  

      
        <ProductGridSection
          title={t('home.featuredProducts')}
          description={t('home.featuredLine')}
          products={(featuredProducts || []).slice(0, 4)}
        />

     
        <DealOfTheWeekSection />
       </Suspense>

       
      </div>
    </>
  );
};

export default Home;
