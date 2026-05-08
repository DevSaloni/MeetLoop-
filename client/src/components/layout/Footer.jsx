import React from 'react';
import Logo from '../Logo';

const Footer = () => {
  return (
    <footer className="py-16 px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
        <div className="flex flex-col gap-6">
          <Logo />
          <p className="text-sm text-on-surface-variant max-w-[300px]">
            The accountability workspace for modern teams. Turning conversations into commitments since 2024.
          </p>
          <div className="flex gap-4">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
          </div>
        </div>
        {[
          { title: 'PRODUCT', links: ['Features', 'Pricing', 'API', 'Changelog'] },
          { title: 'SUPPORT', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
          { title: 'LEGAL', links: ['Privacy', 'Terms', 'Security', 'Compliance'] },
        ].map((col) => (
          <div key={col.title} className="flex flex-col gap-4">
            <h6 className="text-xs font-semibold text-on-surface uppercase tracking-widest">{col.title}</h6>
            {col.links.map((link) => (
              <a key={link} className="text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">{link}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-white/5 flex justify-between items-center text-xs text-on-surface-variant uppercase tracking-widest">
        <span>© 2024 MeetLoop Inc. All rights reserved.</span>
        <span>Status: All Systems Operational</span>
      </div>
    </footer>
  );
};

export default Footer;
