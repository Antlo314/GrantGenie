import React from 'react';

const GlassCard = ({ children, className = '', interactive = false, ...props }) => {
  const baseClass = interactive ? 'glass-card interactive' : 'glass-card';
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;

