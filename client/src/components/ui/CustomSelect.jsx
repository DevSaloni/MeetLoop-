import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ options, value, onChange, placeholder = "Select an option", className = "", itemClassName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    const val = typeof option === 'object' ? option.value : option;
    onChange(val);
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    if (!value) return placeholder;
    const option = options.find(opt => {
        const val = typeof opt === 'object' ? opt.value : opt;
        return val === value;
    });
    if (option) {
        return typeof option === 'object' ? option.label : option;
    }
    return value;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[44px] py-2.5 bg-[#09090B] border ${isOpen ? 'border-primary-container ring-1 ring-primary-container/20 shadow-[0_0_20px_rgba(249,115,22,0.15)]' : 'border-white/10'} rounded-lg px-4 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-white/20`}
      >
        <span className={`text-xs font-semibold ${value ? 'text-white' : 'text-on-surface-variant/40'}`}>
          {getSelectedLabel()}
        </span>
        <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-container' : ''}`}>
          expand_more
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 min-w-full bg-[#111113]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] py-2 animate-fade-in origin-top">
          <div className="max-h-60 overflow-y-auto scrollbar-hide px-2">
            {options.map((option, idx) => {
              const label = typeof option === 'object' ? option.label : option;
              const val = typeof option === 'object' ? option.value : option;
              const isSelected = value === val;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`flex items-center justify-between px-3 py-3 my-1 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    isSelected 
                    ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20' 
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
                  } ${itemClassName}`}
                >
                  <span>{label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-base">check</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
