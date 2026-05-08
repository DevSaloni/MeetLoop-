import React from 'react';

const SettingsPage = () => {
  return (
    <div className="animate-fade-in space-y-10 pb-20 max-w-7xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Settings</h1>
        <p className="text-on-surface-variant font-body-md">Manage your personal profile and application preferences.</p>
      </div>

      <div className="space-y-10">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">person</span>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk' }}>User Profile</h3>
          </div>

          <div className="bg-surface-container border border-white/5 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container p-1 shadow-lg shadow-primary-container/10">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoq05IDgXANntF9Lgi-hpn8Vf1ibAR-Ijb-4hCp-1i2q5QlzaDrB-UMnkdqn5IHVLu-LRobU0J7hSRY5yj7lENBxmcUdXx1z46n5bYXbF4bCGHpeqprAxuWS8GB5yy3O0cg9MIp9p0MuLALS9eLHp-YmKFtXF2Z4WqzYzQ4DSJYQz5U1yDqrTe05u6im_5Ilp2yTYe7-MiyxXs_ezk9lpI106FgvbOX-KGX8Txi_Sb22objxBtzmJJV4itgDQXay91YNKZaZj7Tjs2"
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary-container text-white p-1.5 rounded-full shadow-lg">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Display Name</label>
                  <input type="text" defaultValue="Alex Rivera" className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Job Role</label>
                  <input type="text" defaultValue="Senior Product Manager" className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container outline-none transition-all" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                  <input type="email" defaultValue="alex@meetloop.app" className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container outline-none transition-all" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
              <button className="bg-primary-container text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary-container/10">Save Changes</button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">notifications</span>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk' }}>Preferences</h3>
          </div>

          <div className="bg-surface-container border border-white/5 rounded-2xl p-6 shadow-xl divide-y divide-white/5">
            {[
              { label: 'Email Notifications', desc: 'Receive daily commitment summaries.', enabled: true },
              { label: 'Slack Sync', desc: 'Auto-post decisions to project channels.', enabled: true },
              { label: 'AI Summaries', desc: 'Extract key points after every meeting.', enabled: false }
            ].map(pref => (
              <div key={pref.label} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{pref.label}</h4>
                  <p className="text-xs text-on-surface-variant">{pref.desc}</p>
                </div>
                <button className={`w-12 h-6 rounded-full relative transition-all ${pref.enabled ? 'bg-primary-container' : 'bg-white/10'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pref.enabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">warning</span>
            <h3 className="text-xl font-bold text-red-400 uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk' }}>Danger Zone</h3>
          </div>

          <div className="bg-red-500/[0.02] border border-red-500/10 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="max-w-5xl">
              <h4 className="text-sm font-bold text-white">Delete Workspace</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-1">This action is permanent. All meetings, tasks, and historical data will be wiped from the MeetLoop cloud.</p>
            </div>
            <button className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-red-500/20">Purge Data</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
