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
        className="help-icon-btn text-gold/60 hover:text-gold transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        title="Help"
      >
        <HelpCircle size={18} />
      </button>

      {isOpen && (
        <div 
          ref={tooltipRef}
          className="help-popover glass-panel absolute z-[100] p-5 w-72 left-0 top-full mt-4"
        >
          <div className="flex justify-between items-start mb-3">
            <h5 className="font-display text-sm font-bold text-gold tracking-widest uppercase">{title}</h5>
            <button 
              className="text-muted hover:text-white transition-colors"
              onClick={() => setIsDismissed(true)}
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-secondary leading-relaxed font-sans">{content}</p>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
