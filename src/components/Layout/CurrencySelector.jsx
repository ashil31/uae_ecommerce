
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiChevronDown } from 'react-icons/fi';

const CurrencySelector = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('AED');

  const currencies = [
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' }
  ];

  const handleCurrencyChange = (currency) => {
    setCurrentCurrency(currency.code);
    setIsOpen(false);
    // In a real app, this would update the global currency state
    console.log('Currency changed to:', currency.code);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 hover:text-black rounded-full transition-colors"
      >
        <FiDollarSign size={18} />
        <span className="text-sm font-medium hidden sm:block">
          {currentCurrency}
        </span>
        <FiChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 text-black bg-[#f7f5f1] border shadow-lg rounded-lg py-2 min-w-[140px] z-50"
          >
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                  currentCurrency === currency.code ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span>{currency.symbol}</span>
                <div>
                  <div>{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CurrencySelector;
