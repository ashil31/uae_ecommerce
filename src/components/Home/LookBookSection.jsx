
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import OptimizedImage from '../UI/OptimizedImage';

const LookBookSection = () => {
  const { t } = useTranslation();

  const lookBookItems = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&crop=center',
      title: 'Summer Collection',
      subtitle: 'Casual Elegance',
      link: '/shop/summer'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop&crop=center',
      title: 'Business Attire',
      subtitle: 'Professional Style',
      link: '/shop/business'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1494790108755-2616c041a80b?w=600&h=800&fit=crop&crop=center',
      title: 'Evening Wear',
      subtitle: 'Sophisticated Nights',
      link: '/shop/evening'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 tracking-tight text-gray-900">
            {t('home.lookbook')}
          </h2>
          <p className="text-gray-600 text-base md:text-lg font-light tracking-wide max-w-2xl mx-auto">
            Discover our curated style inspirations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {lookBookItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg bg-gray-100"
            >
              <Link to={item.link} className="block">
                <div className="aspect-[3/4] overflow-hidden">
                  <OptimizedImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                  <div className="p-6 lg:p-8 text-white">
                    <h3 className="text-xl lg:text-2xl font-light mb-2 tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-sm lg:text-base opacity-90 font-light mb-4">
                      {item.subtitle}
                    </p>
                    <span className="inline-block border border-white/40 px-6 py-2 text-sm font-medium hover:bg-[#f7f5f1] hover:text-black transition-all duration-300">
                      Shop the Look
                    </span>
                  </div>
                </div>
                
                <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LookBookSection;
