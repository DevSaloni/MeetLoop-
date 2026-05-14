import React from 'react';
import Logo from '../Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 md:py-16 px-6 md:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-16">
        <div className="flex flex-col gap-6">
          <Logo />
          <p className="text-sm text-on-surface-variant max-w-[300px]">
            The accountability workspace for modern teams. Turning conversations into commitments since 2026.
          </p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:border-primary-container/50 transition-all group" href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" title="Twitter / X">
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:border-primary-container/50 transition-all group" href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">share</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:border-primary-container/50 transition-all group" href="mailto:contact@meetloop.ai" title="Email">
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">alternate_email</span>
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-12 md:gap-16 lg:gap-24">
          <div className="flex flex-col gap-4">
            <h6 className="text-xs font-semibold text-on-surface uppercase tracking-widest">PRODUCT</h6>
            <Link to="/features" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Features</Link>
            <Link to="/how-it-works" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">How it Works</Link>
            <Link to="/for-teams" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">For Teams</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h6 className="text-xs font-semibold text-on-surface uppercase tracking-widest">COMPANY</h6>
            <Link to="/about" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">About Us</Link>
            <Link to="/contact" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Contact</Link>
            <Link to="/" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">Blog</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 md:mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-xs text-on-surface-variant uppercase tracking-widest text-center md:text-left">
        <span>© 2026 MeetLoop Inc. All rights reserved.</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>Status: All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
