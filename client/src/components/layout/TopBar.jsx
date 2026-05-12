import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function TopBar() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Get user initial for avatar
  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="fixed top-0 right-0 left-[240px] z-30 bg-surface border-b border-white/10 flex justify-between items-center h-16 px-6 w-[calc(100%-240px)]">
      {/* Left side spacer instead of search */}
      <div className="flex items-center gap-6">
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors relative">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full border border-surface"></span>
        </button>
        <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined text-on-surface-variant">settings</span>
        </button>
        {user?.role === 'Team Lead' && (
          <button
            onClick={() => navigate('/app/meetings')}
            className="bg-primary-container text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20"
            style={{ fontFamily: 'Inter' }}
          >
            New Meeting
          </button>
        )}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-primary-container flex items-center justify-center text-white text-xs font-bold">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            getInitial()
          )}
        </div>
      </div>
    </header>
  )
}
