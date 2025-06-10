import React from 'react';
import { motion } from 'framer-motion'; // Kept as original code uses motion

const Button = ({ children, onClick, className = '', type = 'button', variant = 'primary', icon: Icon, ...props }) => {
  const baseClasses = 'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-error text-white hover:bg-error/90',
    ghost: 'p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    ghostDanger: 'p-2 text-gray-400 hover:text-error hover:bg-error/10',
  };

  const selectedVariantClasses = variantClasses[variant] || variantClasses.primary;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type={type}
      className={`${baseClasses} ${selectedVariantClasses} ${className}`}
      {...props}
    >
      {Icon && typeof Icon === 'string' ? (
        // This is a workaround if ApperIcon isn't passed directly. 
        // In a real app, you'd import ApperIcon here or pass it as a component.
        // For now, assuming ApperIcon is available globally or passed correctly.
        // This won't work without ApperIcon import. Re-thinking.
        // Let's assume ApperIcon is passed as an element, or use a prop `apperIconName`
        // or just let the parent render the icon next to the button.
        // For simplicity and to avoid new dependencies, pass `ApperIcon` or `children` as is.
        // Let's make it simple and just include className and children, like the original.
        // The original code uses ApperIcon directly inside the button.
        // The QuickAddButton molecule will handle the icon. This atom is just a basic button.
        // The ghost/ghostDanger variants are for icon-only buttons.
        <>
          {Icon}
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;