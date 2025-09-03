import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const FilterSectionTwo = ({ title, children, isOpen, onToggle }) => (
  <div className="py-4 border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center text-left font-semibold text-gray-800"
    >
      <span>{title}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <FiChevronDown size={20} />
      </motion.div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-4 space-y-3">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default FilterSectionTwo;