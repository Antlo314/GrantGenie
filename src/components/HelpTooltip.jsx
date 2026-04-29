import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X } from 'lucide-react';
import gsap from 'gsap';
import './HelpTooltip.css';

const HelpTooltip = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDismissed, setIsDismissed] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (isOpen && tooltipRef.current) {
      gsap.fromTo(tooltipRef.current, 
        { opacity: 0, scale: 0.8, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  if (isDismissed) return null;

  return (
    <div className="relative inline-flex items-center ml-4">
      <button 
        className="help-icon-btn text-periwinkle/40 hover:text-periwinkle transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        title="Help"
      >
        <HelpCircle size={22} />
      </button>

      {isOpen && (
        <div 
          ref={tooltipRef}
          className="help-popover glass-card absolute z-[100] p-6 w-80 left-0 top-full mt-6 shadow-2xl border-periwinkle/20"
        >
          <div className="flex justify-between items-start mb-4">
            <h5 className="text-xs-caps text-periwinkle">{title}</h5>
            <button 
              className="text-secondary hover:text-primary transition-colors"
              onClick={() => setIsDismissed(true)}
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-secondary leading-relaxed font-sans">{content}</p>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;

