
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ProductCard from '../Product/ProductCard';

const BestRatedSection = ({ products = [] }) => {
  const { t } = useTranslation();

  // Don't render if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#f7f5f1]">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 tracking-tight text-gray-900">
            {t('bestRated.title')}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-light tracking-wide max-w-2xl mx-auto">
            {t('bestRated.subtitle')}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12 lg:mt-16"
        >
          <Link
            to="/shop"
            className="inline-block border-2 border-gray-900 px-8 py-4 text-base font-medium hover:bg-gray-900 hover:text-white transition-all duration-300 hover:scale-105 transform tracking-wide rounded-lg"
          >
            {t('bestRated.viewAll')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BestRatedSection;
