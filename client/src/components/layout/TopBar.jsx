import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 right-0 left-[240px] z-30 bg-surface border-b border-white/10 flex justify-between items-center h-16 px-6 w-[calc(100%-240px)]">
      {/* Search */}
      <div className="flex items-center gap-6">
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="w-full bg-background border border-white/10 rounded-md pl-9 py-2 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 transition-all placeholder:text-on-surface-variant/40"
            placeholder="Search tasks, meetings..."
            type="text"
          />
        </div>
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
        <button
          onClick={() => navigate('/app/meetings')}
          className="bg-primary-container text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-container/20"
          style={{ fontFamily: 'Inter' }}
        >
          New Meeting
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoq05IDgXANntF9Lgi-hpn8Vf1ibAR-Ijb-4hCp-1i2q5QlzaDrB-UMnkdqn5IHVLu-LRobU0J7hSRY5yj7lENBxmcUdXx1z46n5bYXbF4bCGHpeqprAxuWS8GB5yy3O0cg9MIp9p0MuLALS9eLHp-YmKFtXF2Z4WqzYzQ4DSJYQz5U1yDqrTe05u6im_5Ilp2yTYe7-MiyxXs_ezk9lpI106FgvbOX-KGX8Txi_Sb22objxBtzmJJV4itgDQXay91YNKZaZj7Tjs2" 
            alt="User Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
