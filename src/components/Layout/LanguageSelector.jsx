import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import { setLanguage } from '../../store/slices/uiSlice';

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { language } = useSelector((state) => state.ui);
  const [isOpen, setIsOpen] = useState(false);

  
  const languages = [
    { code: 'en', name: 'English', flag: '/flags/us.svg' },
    { code: 'ar', name: 'العربية', flag: '/flags/ae.svg' },
    { code: 'fr', name: 'Français', flag: '/flags/fr.svg' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode) => {
    dispatch(setLanguage(langCode));
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Update document direction for RTL
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = langCode;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-[#f7f5f1] hover:text-black transition-colors"
      >
        {/* <FiGlobe size={16} /> */}
        <span>
          <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-5 h-5" />
        </span>
        <span className="text-sm font-medium hidden sm:block">
           {currentLanguage?.name}
        </span>
        <FiChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full right-0 mb-2 text-black bg-[#f7f5f1] border shadow-lg rounded-lg py-2 min-w-[120px] z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f7f5f1] flex items-center space-x-3 ${
                  language === lang.code ? 'bg-[#f7f5f1] font-medium' : ''
                }`}
              >
                <img src={lang.flag} alt={lang.name} className="w-5 h-5" />
                <span>{lang.name}</span>
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

export default LanguageSelector;
