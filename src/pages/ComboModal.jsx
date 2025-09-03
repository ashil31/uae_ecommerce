import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shirt, Component, ShirtIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ComboModal = ({ isOpen, onClose, selectedOption, onSelect }) => {
  const { t } = useTranslation();

  const options = [
    {
      key: 'combo',
      label: t('product.combo'),
      desc: t('product.comboDesc'),
      icon: Component,
      savings: t('product.comboSavings'),
    },
    {
      key: 'shirt',
      label: t('product.shirt'),
      icon: Shirt,
    },
    {
      key: 'pant',
      label: t('product.pant'),
      icon: ShirtIcon,
    },
  ];

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionKey) => {
    onSelect(optionKey);
    onClose();
  };

  // Handle close button click
  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e, optionKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionSelect(optionKey);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="relative w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseClick}
              aria-label="Close modal"
              className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title */}
            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              {t('product.choosePurchaseOption')}
            </h2>

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedOption === opt.key;

                return (
                  <div
                    key={opt.key}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOptionSelect(opt.key)}
                    onKeyDown={(e) => handleKeyDown(e, opt.key)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-md cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-gray-700'}`} />
                    <div className={`text-sm font-medium ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    )}
                    {opt.savings && (
                      <div className="text-xs font-semibold text-green-600">
                        {opt.savings}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComboModal;