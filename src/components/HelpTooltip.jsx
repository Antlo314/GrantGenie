import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import './HelpTooltip.css';

const HelpTooltip = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="relative inline-flex items-center">
      <button 
        className="help-icon-btn ml-2 text-gold animate-pulse"
        onClick={() => setIsOpen(!isOpen)}
        title="Help"
      >
        <HelpCircle size={16} />
      </button>

      {isOpen && (
        <div className="help-popover glass-panel absolute z-50 p-4 w-64 top-full left-1/2 -translate-x-1/2 mt-2">
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-display text-sm font-bold text-gold">{title}</h5>
            <button 
              className="text-muted hover:text-white"
              onClick={() => setIsDismissed(true)}
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-primary leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
