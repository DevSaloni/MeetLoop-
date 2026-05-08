import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/10">
      <div className="flex justify-between items-center h-20 px-8 w-full max-w-7xl mx-auto">
        <Link to="/">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link className="text-sm text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/">Home</Link>
          <Link className="text-sm text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/how-it-works">How it Works</Link>
          <Link className="text-sm text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/features">Features</Link>
          <Link className="text-sm text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/for-teams">For Teams</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="bg-primary-container text-white font-bold px-8 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary-container/20"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
