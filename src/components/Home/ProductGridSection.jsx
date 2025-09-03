// path: components/Home/ProductGridSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../Product/ProductCard';

const ProductGridSection = ({ title, description, products = [], gridClass = '' }) => {
  if (!products.length) return null;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#f7f5f1]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl lg:text-5xl font-light text-gray-900 mb-4">{title}</h2>
          {description && (
            <p className="text-gray-600 max-w-2xl mx-auto font-light">{description}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={gridClass || 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'}
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(ProductGridSection);
