// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
