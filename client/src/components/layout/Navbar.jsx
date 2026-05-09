import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  // Get user initial for avatar
  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#09090B]/80 backdrop-blur-md border-b border-white/5">
      <div className="flex justify-between items-center h-20 px-8 w-full max-w-7xl mx-auto">
        <Link to="/">
          <Logo />
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link className="text-sm font-medium text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/">Home</Link>
          <Link className="text-sm font-medium text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/how-it-works">How it Works</Link>
          <Link className="text-sm font-medium text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/features">Features</Link>
          <Link className="text-sm font-medium text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/for-teams">For Teams</Link>
          {user && (
            <Link className="text-sm font-medium text-on-surface-variant hover:text-primary-container transition-colors duration-200" to="/app">Dashboard</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 group cursor-default">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-container/20 group-hover:scale-110 transition-transform overflow-hidden">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitial()
                )}
              </div>
            </div>
          ) : (
            <Link 
              to="/signup" 
              className="bg-primary-container text-white font-bold px-8 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-lg shadow-primary-container/20"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
