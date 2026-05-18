import React from 'react';
import Logo from '../Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-[#09090B] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Oversized Typography - Subtler */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.01] whitespace-nowrap">
        <span className="text-[120px] md:text-[250px] font-black tracking-tighter uppercase leading-none text-white" style={{ fontFamily: 'Space Grotesk' }}>
          MEETLOOP
        </span>
      </div>

      {/* Glow Effects */}
      <div className="absolute -top-24 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 right-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="mb-8 scale-125 transition-transform hover:scale-110 duration-700 cursor-pointer">
            <Logo />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Transforming Talk into <span className="text-orange-500">Measurable Action</span>.
          </h3>

          <p className="text-[13px] md:text-sm text-on-surface-variant max-w-[450px] leading-relaxed opacity-60">
            MeetLoop is the accountability workspace for modern, high-performance teams.
            We kill the unproductive meeting cycle through AI-powered codification of commitments.
          </p>
        </div>

        {/* Bottom Bar: Socials + Info */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-12 border-t border-white/5">
          {/* Social Icons - Premium Style */}
          <div className="flex items-center gap-4">
            {[
              { icon: 'public', label: 'Twitter', link: '#' },
              { icon: 'share', label: 'LinkedIn', link: '#' },
              { icon: 'alternate_email', label: 'Email', link: 'mailto:contact@meetloop.ai' }
            ].map((social) => (
              <a
                key={social.label}
                href={social.link}
                className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all duration-300 group"
                title={social.label}
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>

          {/* Copyright & Meta info - Reduced Font Size */}
          <div className="flex flex-col md:items-end gap-3 text-center md:text-right">
            <div className="text-[9px] md:text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">
              © 2026 MeetLoop Inc.
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
    </footer>
  );
};

export default Footer;
