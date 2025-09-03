
import React from 'react';
import { motion } from 'framer-motion';


const Loading = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`border-2 border-gray-300 border-t-black rounded-full ${sizeClasses[size]}`}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default Loading;
