import React from 'react';
import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';
import OptimizedImage from '../UI/OptimizedImage';
import { ImageUrl } from '../../services/url';

const LookbookCard = ({ lookbook, onOpen }) => {
  const img = `${ImageUrl}${lookbook.featuredImage}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group cursor-pointer rounded-3xl overflow-hidden bg-gray-100 shadow-lg"
      onClick={() => onOpen(lookbook)}
    >
      {/* Hero */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <OptimizedImage
          src={img}
          alt={lookbook.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Metadata Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {lookbook.season && (
            <span className="badge-dark">
              {lookbook.season} {lookbook.year}
            </span>
          )}
          <span className="badge-light">{lookbook.products.length} Items</span>
        </div>

        {/* Hover CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 flex items-center justify-center"
        >
          <FiEye className="text-white" size={26} />
        </motion.div>
      </div>

      {/* Title + Themes */}
      <div className="p-5 text-center space-y-1">
        <h3 className="text-lg font-light line-clamp-1">{lookbook.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {lookbook.tags?.slice(0, 3).map(t => `#${t}`).join(' ')}
        </p>
      </div>
    </motion.div>
  );
};

export default LookbookCard;
