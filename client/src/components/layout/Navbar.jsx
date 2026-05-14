import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsMenuOpen(false);
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'HOW IT WORKS', path: '/how-it-works' },
    { name: 'FEATURES', path: '/features' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-[#09090B]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="flex justify-between items-center h-16 md:h-20 px-6 lg:px-8 w-full max-w-7xl mx-auto">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="relative z-[110]">
            <Logo />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                className={`text-sm font-medium transition-all duration-200 capitalize ${location.pathname === link.path ? 'text-primary-container' : 'text-on-surface-variant hover:text-white'}`}
                to={link.path}
              >
                {link.name.toLowerCase()}
              </Link>
            ))}
            {user && (
              <Link className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors capitalize" to="/app">Dashboard</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              {user ? (
                <Link to="/app" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-container/20 group-hover:ring-2 ring-primary-container/50 transition-all overflow-hidden border border-white/10">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getInitial()
                    )}
                  </div>
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="btn-primary-premium text-white font-bold px-7 py-2.5 rounded-xl text-xs uppercase tracking-widest"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 text-white focus:outline-none relative z-[110]"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Menu"
            >
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'wght' 300" }}>
                menu
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop - Outside nav to avoid blur issues */}
      <div
        className={`md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[140] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Sidebar Drawer - Solid Black Theme */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-[280px] sm:w-[320px] bg-[#09090B] border-l border-white/5 z-[150] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: '#09090B' }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-8 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="MeetLoop" className="w-full h-full object-contain" />
            </div>
            <span className="text-[16px] font-bold text-white tracking-[0.2em] uppercase" style={{ fontFamily: 'Space Grotesk' }}>MeetLoop</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">

          {/* User Profile Section (Inside Drawer) */}
          {user && (
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-container/20 border border-white/10 overflow-hidden">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    getInitial()
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-bold text-sm truncate uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk' }}>{user.name || 'User'}</span>
                  <span className="text-gray-500 text-[10px] truncate uppercase tracking-widest">{user.email || 'meetloop@ai.com'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="py-6 px-4 flex flex-col flex-1">
            {/* Main Navigation Links */}
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all group ${isActive ? 'bg-white/[0.03]' : 'hover:bg-white/[0.03]'}`}
                  >
                    <span className={`text-[13px] font-semibold tracking-[0.15em] ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {link.name}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-white/5 my-6 mx-6"></div>

            {/* User/Dashboard Links */}
            <div className="flex flex-col gap-1">
              {user ? (
                <>
                  <Link
                    to="/app"
                    className="flex items-center justify-between px-6 py-4 rounded-xl hover:bg-white/[0.03] transition-all group"
                  >
                    <span className="text-[13px] font-semibold tracking-[0.15em] text-gray-300 group-hover:text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                      MY DASHBOARD
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-6 py-4 rounded-xl hover:bg-white/[0.03] transition-all group text-left"
                  >
                    <span className="text-[13px] font-semibold tracking-[0.15em] text-orange-500 group-hover:text-orange-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                      LOGOUT
                    </span>
                    <span className="material-symbols-outlined text-orange-500 text-xl" style={{ fontVariationSettings: "'wght' 300" }}>logout</span>
                  </button>
                </>
              ) : (
                <div className="px-4 pt-4 flex flex-col gap-4">
                  <Link
                    to="/signup"
                    className="flex items-center justify-center w-full h-14 bg-orange-500 rounded-xl text-[12px] font-bold tracking-[0.2em] text-white hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20"
                    style={{ fontFamily: 'Space Grotesk' }}
                  >
                    GET STARTED
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center w-full h-14 border border-white/10 rounded-xl text-[12px] font-bold tracking-[0.2em] text-gray-400 hover:text-white hover:border-white/20 transition-all"
                    style={{ fontFamily: 'Space Grotesk' }}
                  >
                    LOG IN
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
