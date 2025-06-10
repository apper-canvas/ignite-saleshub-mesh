import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickActionButton = ({ icon, label, onClick, className = '', buttonVariant = 'primary' }) => {
  return (
    <Button onClick={onClick} className={className} variant={buttonVariant}>
      <ApperIcon name={icon} size={16} />
      <span>{label}</span>
    </Button>
  );
};

export default QuickActionButton;