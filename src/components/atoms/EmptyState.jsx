import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion'; // Used for potential button animations if passed

const EmptyState = ({
  iconName,
  title,
  description,
  buttonText,
  onButtonClick,
  className = '',
  buttonClassName = '',
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      {iconName && (
        <ApperIcon name={iconName} size={48} className="text-gray-300 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick} className={buttonClassName}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;