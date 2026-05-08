import React from 'react';

const Logo = ({ className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="w-10 h-10 flex items-center justify-center">
      <img src="/logo.png" alt="MeetLoop" className="w-full h-full object-contain" />
    </div>
    <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>MeetLoop</span>
  </div>
);

export default Logo;
