import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/app' },
  { icon: 'verified', label: 'Accountability', path: '/app/commitments' },
  { icon: 'groups', label: 'Meetings', path: '/app/meetings' },
  { icon: 'group_work', label: 'Teams', path: '/app/teams' },
  { icon: 'leaderboard', label: 'Analytics', path: '/app/analytics' },
  { icon: 'settings', label: 'Settings', path: '/app/settings' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Signed out successfully');
    navigate('/');
    setTimeout(() => {
      logout();
    }, 0);
  };

  return (
    <nav className={`fixed left-0 top-0 h-screen w-[240px] z-[50] bg-[#0E0E10] border-r border-white/10 flex flex-col py-6 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Sidebar Header */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MeetLoop Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary-container" style={{ fontFamily: 'Space Grotesk' }}>
              MeetLoop
            </span>
          </div>
          <p className="text-[9px] font-black text-primary-container mt-1 tracking-widest uppercase opacity-80" style={{ fontFamily: 'Inter' }}>
            Accountability Workspace
          </p>
        </div>
        <button onClick={onClose} className="lg:hidden text-on-surface-variant hover:text-white">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* New Meeting Button — Team Lead Only */}
      {user?.role === 'Team Lead' && (
        <div className="px-4 mb-6">
          <NavLink
            to="/app/new-meeting"
            className="w-full bg-primary-container text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary-container/20 text-[10px] uppercase tracking-widest"
            style={{ fontFamily: 'Inter' }}
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Meeting
          </NavLink>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-on-surface-variant hover:bg-white/[0.03] hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ fontFamily: 'Inter' }}>
            Home
          </span>
        </NavLink>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                ? 'bg-primary-container/10 text-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-white/[0.03] hover:text-on-surface'
              }`
            }
          >
            <span className={`material-symbols-outlined text-xl ${location.pathname === item.path ? 'fill-1' : ''}`}>{item.icon}</span>
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ fontFamily: 'Inter' }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="px-3 pt-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-on-surface-variant px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <span className="material-symbols-outlined text-xl group-hover:fill-1">logout</span>
          <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={{ fontFamily: 'Inter' }}>
            Sign Out
          </span>
        </button>
      </div>
    </nav>
  )
}
