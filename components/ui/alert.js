// components/ui/alert.js
import React from 'react';

const Alert = ({ variant, children }) => {
  const alertStyles = {
    destructive: 'bg-red-100 text-red-700 border-red-400',
    info: 'bg-blue-100 text-blue-700 border-blue-400',
    success: 'bg-green-100 text-green-700 border-green-400',
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-md mb-4 ${alertStyles[variant] || ''}`}
      role="alert"
    >
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);

export { Alert, AlertDescription };
