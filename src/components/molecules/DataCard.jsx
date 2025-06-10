import React from 'react';
import { motion } from 'framer-motion';

const DataCard = ({ children, className = '', onClick, ...props }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition-all ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default DataCard;