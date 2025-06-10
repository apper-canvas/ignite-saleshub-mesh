import React from 'react';

const Spinner = ({ className = '', size = '24' }) => {
  return (
    <div 
      className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;