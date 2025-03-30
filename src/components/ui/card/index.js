import React from 'react';

export const Card = ({ className, children, ...props }) => {
  return <div className={`bg-white rounded-lg shadow ${className || ''}`} {...props}>{children}</div>;
};

export const CardContent = ({ className, children, ...props }) => {
  return <div className={`p-6 ${className || ''}`} {...props}>{children}</div>;
};

export const CardHeader = ({ className, children, ...props }) => {
  return <div className={`p-6 pb-0 ${className || ''}`} {...props}>{children}</div>;
};

export const CardTitle = ({ className, children, ...props }) => {
  return <h3 className={`text-xl font-bold ${className || ''}`} {...props}>{children}</h3>;
};
