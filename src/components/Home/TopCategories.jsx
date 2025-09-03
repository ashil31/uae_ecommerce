import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const getItemsToShow = (width) => {
  if (width < 640) return 2;
  if (width < 1024) return 4;
  return 6;
};

const TopCategories = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const baseCategories = [
    { name: 'categories.shirt',parent: 'men', icon: <img src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fhome%2Fdemo5%2Fcategory_8.png&w=256&q=75" alt="shirts" /> },
    { name: 'categories.handbags', parent: 'women', icon: <img src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fhome%2Fdemo5%2Fcategory_1.png&w=256&q=75" alt="handbags" /> },
    { name: 'categories.clothing',parent: 'women', icon: <img src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fhome%2Fdemo5%2Fcategory_2.png&w=256&q=75" alt="clothing" /> },
    { name: 'categories.jacket', parent: 'men',icon: <img src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fhome%2Fdemo5%2Fcategory_3.png&w=256&q=75" alt="jackets" /> },
    { name: 'categories.watches', parent: 'men',icon: <img src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fhome%2Fdemo5%2Fcategory_4.png&w=256&q=75" alt="watches" /> },
    { name: 'categories.dress',parent: 'women', icon: <img src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fhome%2Fdemo5%2Fcategory_5.png&w=256&q=75" alt="dresses" /> },
    { name: 'categories.shoes',parent: 'men', icon: <img src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fhome%2Fdemo5%2Fcategory_6.png&w=256&q=75" alt="shoes" /> },
    { name: 'categories.jeans',parent: 'men', icon: <img src="https://uomo-nextjs-ecommerce.vercel.app/_next/image?url=%2Fassets%2Fimages%2Fhome%2Fdemo5%2Fcategory_7.png&w=256&q=75" alt="jeans" /> }
  ];

  const categories = [...baseCategories, ...baseCategories]

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(
    typeof window !== 'undefined' ? getItemsToShow(window.innerWidth) : 4
  );

  const controls = useAnimation();
  const SLIDE_DURATION = 3000;

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setItemsToShow(getItemsToShow(window.innerWidth));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % baseCategories.length;
      setCurrentIndex(nextIndex);

      const direction = isRTL
        ? nextIndex * (100 / itemsToShow)
        : nextIndex * (100 / itemsToShow);

      controls.start({
        x: `${direction}%`,
        transition: { duration: 0.6, ease: 'easeInOut' }
      });
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, itemsToShow, isRTL, controls]);

  return (
    <div className="bg-[#f7f5f1] py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-6 sm:mb-8">
          {t('categories.topCategories')}
        </h2>

        <div
          className="relative overflow-hidden w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div
            className={`flex ${!isRTL ? 'flex-row-reverse' : ''}`}
            animate={controls}
            initial={{ x: '0%' }}
          >
            {categories.map((category, index) =>{ 
               if (!category || !category.name) {
        return null;
    }
               const categoriesSlug = category.name ? category.name.split('.').pop() : '';

  // Create the path dynamically based on whether a 'parent' exists
    const path = category.parent
        ? `/shop/${category.parent}/${categoriesSlug}`
        : `/shop/${categoriesSlug}`;

              return(
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <div className="flex flex-col items-center cursor-pointer">
                  <Link 
                        to={path}
                        className="flex flex-col items-center cursor-pointer"
                      >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#f7f5f1] rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-2 sm:mb-3 hover:shadow-md transition-all duration-300 hover:scale-110">
                    {category.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 text-center hover:text-gray-900 transition-colors duration-300">
                    {t(category.name)}
                  </span>
                  </Link>
                </div>
              </div>
            )})}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
