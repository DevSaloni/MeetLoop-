import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const CustomDatePicker = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);

  const openMenu = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = 320;
      const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

      setMenuStyle({
        position: 'fixed',
        left: `${rect.left}px`,
        width: '280px',
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
    const handleScroll = () => setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(selectedDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = startDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const displayDate = value ? new Date(value).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }) : "Select Date";

  const calendar = isOpen ? createPortal(
    <div
      ref={menuRef}
      style={menuStyle}
      className="bg-[#111113] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-3 animate-fade-in backdrop-blur-xl"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <button onMouseDown={(e) => { e.preventDefault(); handlePrevMonth(e); }} className="p-1 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-all">
          <span className="material-symbols-outlined text-base">chevron_left</span>
        </button>
        <div className="text-[11px] font-bold text-white uppercase tracking-widest">
          {months[viewDate.getMonth()]} {viewDate.getFullYear()}
        </div>
        <button onMouseDown={(e) => { e.preventDefault(); handleNextMonth(e); }} className="p-1 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-all">
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[9px] font-bold text-on-surface-variant/40 text-center uppercase py-0.5">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const isSelected = value &&
            new Date(value).getDate() === day &&
            new Date(value).getMonth() === viewDate.getMonth() &&
            new Date(value).getFullYear() === viewDate.getFullYear();
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === viewDate.getMonth() &&
            new Date().getFullYear() === viewDate.getFullYear();
          return (
            <div
              key={day}
              onMouseDown={(e) => { e.preventDefault(); handleDateSelect(day); }}
              className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-lg cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-primary-container text-white shadow-lg shadow-primary-container/30'
                  : isToday
                    ? 'border border-primary-container/40 text-primary-container'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
        <button
          onMouseDown={(e) => { e.preventDefault(); onChange(new Date().toISOString().split('T')[0]); setIsOpen(false); }}
          className="text-[8px] font-black text-primary-container uppercase tracking-widest hover:underline"
        >
          Today
        </button>
        <button
          onMouseDown={(e) => { e.preventDefault(); setIsOpen(false); }}
          className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest hover:text-white"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className={`relative ${className}`} ref={triggerRef}>
      <div
        onClick={openMenu}
        className={`w-full min-h-[40px] py-2 bg-[#09090B] border ${
          isOpen
            ? 'border-primary-container ring-1 ring-primary-container/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
            : 'border-white/10 hover:border-white/20'
        } rounded-lg px-3 flex items-center justify-between cursor-pointer transition-all duration-200`}
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant/60 text-base">calendar_month</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${value ? 'text-white' : 'text-on-surface-variant/40'}`}>
            {displayDate}
          </span>
        </div>
        <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-primary-container' : ''}`}>
          expand_more
        </span>
      </div>
      {calendar}
    </div>
  );
};

export default CustomDatePicker;
