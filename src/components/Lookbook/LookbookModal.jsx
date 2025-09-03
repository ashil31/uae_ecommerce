import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import OptimizedImage from '../UI/OptimizedImage';
import { ImageUrl } from '../../services/url';

const format = p =>
  new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(p);

export default function LookbookModal({ lookbook, onClose, onShopAll }) {
  if (!lookbook) return null;

  const hero = `${ImageUrl}${lookbook.featuredImage}`;
  const total = lookbook.products.reduce(
    (s, p) => s + (p.discountedPrice || p.additionalInfo?.price || p.basePrice || 0),
    0
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="relative bg-white/5 rounded-3xl w-full max-w-6xl overflow-hidden flex flex-col lg:flex-row"
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20"
          >
            <FiX size={18} />
          </button>

          {/* Left – hero */}
          <div className="flex-[1.2] p-6 lg:p-10 flex items-center justify-center">
            <OptimizedImage
              src={hero}
              alt={lookbook.title}
              className="max-h-[80vh] object-contain rounded-2xl"
            />
          </div>

          {/* Right – details */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 text-white space-y-6">
            <div>
              <h2 className="text-3xl font-light mb-2">{lookbook.title}</h2>
              <p className="opacity-80">{lookbook.description}</p>
              <p className="text-sm opacity-60 mt-2">
                {lookbook.season} {lookbook.year} • {lookbook.products.length} items
              </p>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-2">
              {lookbook.products.map(p => (
                <div key={p._id} className="bg-white/10 p-3 rounded-lg">
                  <OptimizedImage
                    src={`${ImageUrl}${p.images?.[0]?.url}`}
                    alt={p.name}
                    className="aspect-square object-cover rounded"
                  />
                  <p className="mt-2 text-xs line-clamp-1">{p.name}</p>
                  <p className="text-xs font-medium">{format(p.discountedPrice || p.additionalInfo?.price)}</p>
                </div>
              ))}
            </div>

            {/* Shop the Look */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-white text-black py-4 rounded-full font-medium flex items-center justify-center gap-2"
              onClick={() => onShopAll(lookbook)}
            >
              <FiShoppingBag size={18} />
              Shop the Look — {format(total)}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
