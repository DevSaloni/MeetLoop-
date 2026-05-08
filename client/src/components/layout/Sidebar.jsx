import { NavLink } from 'react-router-dom'

const navItems = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'dashboard', label: 'Dashboard', path: '/app' },
  { icon: 'verified', label: 'Accountability', path: '/app/commitments' },
  { icon: 'groups', label: 'Meetings', path: '/app/meetings' },
  { icon: 'group_work', label: 'Teams', path: '/app/teams' },
  { icon: 'leaderboard', label: 'Analytics', path: '/app/analytics' },
  { icon: 'settings', label: 'Settings', path: '/app/settings' },
]

const bottomItems = [
  { icon: 'logout', label: 'Sign Out', path: '/' },
]

export default function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 h-screen w-[240px] z-40 bg-surface-container border-r border-white/10 flex flex-col py-6">
      {/* Logo */}
      <div className="px-4 mb-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MeetLoop Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-primary-container" style={{ fontFamily: 'Space Grotesk' }}>
            MeetLoop
          </span>
        </div>
        <p className="text-[10px] font-bold text-primary-container mt-1 tracking-widest uppercase opacity-80" style={{ fontFamily: 'Inter' }}>
          Accountability Workspace
        </p>
      </div>

      {/* New Meeting Button */}
      <div className="px-4 mb-6">
        <NavLink
          to="/app/new-meeting"
          className="w-full bg-primary-container text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary-container/20 text-[10px] uppercase tracking-widest"
          style={{ fontFamily: 'Inter' }}
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Meeting
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 transition-all ${isActive
                ? 'bg-primary-container/10 text-primary-container border-r-4 border-primary-container'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ fontFamily: 'Inter' }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Bottom */}
      <div className="px-2 space-y-1 border-t border-white/5 pt-4">
        {bottomItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className="flex items-center gap-2 text-on-surface-variant px-4 py-2 hover:bg-white/5 hover:text-on-surface transition-all"
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-xs font-semibold tracking-wide uppercase" style={{ fontFamily: 'Inter' }}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
