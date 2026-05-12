import React, { useState, useRef, useEffect } from 'react';

const CustomDatePicker = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Parse initial date or use today
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
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

  // Format display date
  const displayDate = value ? new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : "Select Date";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 bg-[#09090B] border ${isOpen ? 'border-primary-container ring-1 ring-primary-container/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'border-white/10'} rounded-lg px-4 flex items-center justify-between cursor-pointer transition-all duration-300 hover:border-white/20`}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant/60 text-lg">calendar_month</span>
          <span className={`text-[11px] font-medium ${value ? 'text-white' : 'text-on-surface-variant/40'}`}>
            {displayDate}
          </span>
        </div>
        <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-container' : ''}`}>
          expand_more
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-[#111113]/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[100] p-4 animate-fade-in origin-top">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <div className="text-sm font-bold text-white uppercase tracking-widest">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>
            <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/5 rounded-lg text-on-surface-variant hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-[10px] font-bold text-on-surface-variant/40 text-center uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const isSelected = value && new Date(value).getDate() === day &&
                new Date(value).getMonth() === viewDate.getMonth() &&
                new Date(value).getFullYear() === viewDate.getFullYear();
              const isToday = new Date().getDate() === day &&
                new Date().getMonth() === viewDate.getMonth() &&
                new Date().getFullYear() === viewDate.getFullYear();

              return (
                <div
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`aspect-square flex items-center justify-center text-[11px] font-bold rounded-lg cursor-pointer transition-all duration-200
                    ${isSelected
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
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <button
              onClick={() => { onChange(new Date().toISOString().split('T')[0]); setIsOpen(false); }}
              className="text-[9px] font-bold text-primary-container uppercase tracking-widest hover:underline"
            >
              Today
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
