import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const CustomSelect = ({ options, value, onChange, placeholder = "Select an option", className = "", itemClassName = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  // Calculate fixed position when opening
  const openMenu = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 300; // max-h approx
      const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

      setMenuStyle({
        position: 'fixed',
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        minWidth: `${Math.max(rect.width, 160)}px`,
        zIndex: 99999,
        ...(openUpward
          ? { bottom: `${window.innerHeight - rect.top + 6}px` }
          : { top: `${rect.bottom + 6}px` }),
      });
    }
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleScroll = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleSelect = (option) => {
    const val = typeof option === 'object' ? option.value : option;
    onChange(val);
    setIsOpen(false);
  };

  const getSelectedLabel = () => {
    const option = options.find(opt => {
      const val = typeof opt === 'object' ? opt.value : opt;
      return val === value;
    });
    if (option) return typeof option === 'object' ? option.label : option;
    if (!value && value !== 0) return placeholder;
    return value;
  };

  const menu = isOpen ? createPortal(
    <div
      ref={menuRef}
      style={menuStyle}
      className="bg-[#111113] border border-white/10 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.7)] py-2 animate-fade-in origin-top backdrop-blur-xl"
    >
      <div className="max-h-72 overflow-y-auto px-2 custom-scrollbar">
        {options.map((option, idx) => {
          const label = typeof option === 'object' ? option.label : option;
          const val = typeof option === 'object' ? option.value : option;
          const isSelected = value === val;
          return (
            <div
              key={idx}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(option); }}
              className={`flex items-center justify-between px-3 py-2.5 my-0.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 ${isSelected
                ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
                } ${itemClassName}`}
            >
              <span>{label}</span>
              {isSelected && <span className="material-symbols-outlined text-sm">check</span>}
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      <div
        onClick={openMenu}
        className={`w-full min-h-[40px] py-2 bg-[#09090B] border ${isOpen
          ? 'border-primary-container ring-1 ring-primary-container/20 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
          : 'border-white/10 hover:border-white/20'
          } rounded-lg px-3 flex items-center justify-between cursor-pointer transition-all duration-200`}
      >
        <span className={`text-xs font-semibold truncate ${value !== null && value !== undefined && value !== '' ? 'text-white' : 'text-on-surface-variant/40'}`}>
          {getSelectedLabel()}
        </span>
        <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform duration-300 flex-shrink-0 ml-1 ${isOpen ? 'rotate-180 text-primary-container' : ''}`}>
          expand_more
        </span>
      </div>
      {menu}
    </div>
  );
};

export default CustomSelect;
