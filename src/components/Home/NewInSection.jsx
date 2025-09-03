
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../Product/ProductCard';

const NewInSection = ({ products }) => {
  const { t } = useTranslation();
  const { isRTL } = useSelector((state) => state.ui);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;
  const maxSlides = Math.ceil(products.length / itemsPerSlide);

  // Don't render if no products
  if (!products || products.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  return (
    <section className="py-16 lg:py-24 bg-[#f7f5f1]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 lg:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light mb-3 sm:mb-4 tracking-tight text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('home.newArrivals')}
            </h2>
            <p className={`text-gray-600 text-sm sm:text-base md:text-lg font-light tracking-wide max-w-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
             {t('home.newArrivalsSubtitle')}

            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex  items-center space-x-6"
          >
            <Link
              to="/shop/new-in"
              className="text-sm md:text-base font-medium hover:underline tracking-wide transition-all duration-300"
            >
              {t('common.viewAll')}
            </Link>
            
            <div className="flex space-x-1 sm:space-x-2">
              <button
                onClick={prevSlide}
                className="p-1.5 sm:p-2 lg:p-3 border border-gray-300 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 hover:scale-110 transform disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentSlide === 0}
                aria-label={t('common.prev')}
              >
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 sm:p-2 lg:p-3 border border-gray-300 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 hover:scale-110 transform disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentSlide === maxSlides - 1}
                aria-label={t('common.next')}
              >
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {Array.from({ length: maxSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
                  {products
                    .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                    .map((product, index) => (
                      <motion.div
                        key={product._id || product.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Slide Indicators */}
        {maxSlides > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center mt-8 lg:mt-12 space-x-2"
          >
            {Array.from({ length: maxSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-gray-900 scale-110' 
                    : 'bg-gray-300 hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NewInSection;