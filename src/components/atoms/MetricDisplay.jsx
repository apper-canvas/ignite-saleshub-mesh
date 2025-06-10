import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const MetricDisplay = ({ title, value, change, icon, gradient, className = '' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-success' : 'text-error'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${gradient}`}>
          <ApperIcon name={icon} size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricDisplay;