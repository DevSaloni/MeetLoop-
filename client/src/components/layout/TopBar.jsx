import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { useSearch } from '../../context/SearchContext'

export default function TopBar({ onMenuClick }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const { searchQuery, setSearchQuery } = useSearch()
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif._id);
    setShowNotifications(false);
    if (notif.link) navigate(notif.link);
  };

  const showSearch = [
    '/app/teams',
    '/app/meetings',
    '/app/commitments'
  ].includes(location.pathname);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[240px] z-40 bg-[#09090B]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center h-16 md:h-20 px-4 md:px-8">
      {/* Left side: Menu toggle + Context Title/Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {showSearch && (
          <div className="relative w-full max-w-[400px] group animate-fade-in">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-container transition-colors text-lg md:text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${location.pathname.split('/').pop()}...`}
              className="w-full bg-[#111113] border border-white/10 rounded-xl py-2 md:py-3 pl-10 md:pl-11 pr-4 text-xs md:text-[13px] text-white focus:border-primary-container/50 outline-none transition-all placeholder:text-on-surface-variant/40"
            />
          </div>
        )}
      </div>

      {/* Right side: Notifications + User */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search Toggle Removed as actual input is now shown */}

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center hover:bg-white/5 rounded-full transition-all relative group"
          >
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-white transition-colors text-[26px] md:text-[28px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 md:top-1 md:right-1.5 w-4 h-4 bg-primary-container text-[9px] text-white rounded-full flex items-center justify-center font-black border border-[#09090B] shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-[320px] md:w-[400px] bg-[#111113] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[9px] font-black text-primary-container uppercase hover:underline tracking-widest"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-on-surface-variant/40">
                    <span className="material-symbols-outlined text-4xl mb-3 opacity-20">notifications_off</span>
                    <p className="text-[11px] font-bold uppercase tracking-widest">All caught up</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 md:p-5 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 flex gap-4 ${!notif.read ? 'bg-primary-container/5' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${!notif.read ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20' : 'bg-white/5 text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-lg">
                          {notif.type === 'TASK_ASSIGNED' ? 'assignment' :
                            notif.type === 'MEETING_CREATED' ? 'video_call' :
                              notif.type === 'TASK_COMPLETED' ? 'check_circle' :
                                notif.type === 'TASK_REMINDER' ? 'notifications_active' : 'info'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-bold text-white truncate ${!notif.read ? '' : 'opacity-70'}`}>{notif.title}</p>
                        <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                        <p className={`text-[9px] ${!notif.read ? 'text-primary-container' : 'text-on-surface-variant/40'} mt-2 uppercase tracking-widest font-black`}>
                          {new Date(notif.createdAt).toLocaleDateString()} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-white/5 mx-1 hidden md:block"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={() => navigate('/app/settings')}>
          <div className="flex flex-col items-end hidden lg:flex">
            <span className="text-[11px] font-bold text-white group-hover:text-primary-container transition-colors uppercase tracking-wider">{user?.name}</span>
            <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{user?.role}</span>
          </div>
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border border-white/10 bg-primary-container flex items-center justify-center text-white text-sm font-bold shadow-xl shadow-primary-container/10 group-hover:ring-2 ring-primary-container/30 transition-all">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="User Profile" className="w-full h-full object-cover" />
            ) : (
              getInitial()
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
