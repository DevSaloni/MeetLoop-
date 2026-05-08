import React from 'react';

const TeamAccountabilityPage = () => {
  const stats = [
    { label: "Team Members", value: "12", sub: "2 new this month", trend: "+2", icon: "groups", color: "#60A5FA" },
    { label: "Total Commitments", value: "148", sub: "Oct 2023 total", icon: "assignment", color: "#FBBF24" },
    { label: "Avg Completion Rate", value: "84.2%", sub: "+1.2% vs Sep", trend: "up", icon: "trending_up", color: "#4ADE80" },
    { label: "Overdue Total", value: "7", sub: "Critical level", icon: "priority_high", color: "#F87171", isError: true }
  ];

  const team = [
    { name: "Marcus Chen", role: "Senior Frontend Dev", rate: 62, done: 12, open: 4, overdue: 3, risk: "At Risk", statusColor: "#F87171" },
    { name: "Sarah Jenkins", role: "Product Designer", rate: 94, done: 28, open: 2, overdue: 0, statusColor: "#4ADE80" },
    { name: "David Miller", role: "Backend Architect", rate: 81, done: 19, open: 4, overdue: 1, statusColor: "#FBBF24" },
    { name: "Elena Sokolov", role: "QA Lead", rate: 58, done: 10, open: 5, overdue: 4, risk: "At Risk", statusColor: "#F87171" },
    { name: "James Wilson", role: "Security Engineer", rate: 100, done: 15, open: 0, overdue: 0, statusColor: "#4ADE80" },
    { name: "Lina Park", role: "Systems Ops", rate: 78, done: 18, open: 5, overdue: 0, statusColor: "#FBBF24" }
  ];

  const escalations = [
    { name: "Marcus Chen", alert: "3 Critical Overdue Items", detail: "Missing 'API Security Audit' for 4 consecutive days." },
    { name: "Elena Sokolov", alert: "4 Critical Overdue Items", detail: "QA phase blocked by unfinished regression scripts." }
  ];

  return (
    <div className="animate-fade-in flex flex-col xl:flex-row gap-8 h-full">
      {/* Dashboard Canvas */}
      <div className="flex-1 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Team Accountability — Oct 2023</h1>
            <p className="text-on-surface-variant font-body-md">Tracking commitment completion across Engineering Team A.</p>
          </div>
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-white/5">
            {['Sep', 'Oct', 'Nov'].map(m => (
              <button key={m} className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${m === 'Oct' ? 'bg-primary-container text-white shadow-lg' : 'text-on-surface-variant hover:text-white'
                }`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`bg-surface-container border px-5 py-6 rounded-xl transition-all ${s.isError ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-white/5 hover:border-white/10'
              }`}>
              <span className={`text-[10px] font-bold uppercase tracking-[0.15em] block mb-4 ${s.isError ? 'text-red-400' : 'text-on-surface-variant/60'}`}>{s.label}</span>
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className={`text-4xl font-bold ${s.isError ? 'text-red-400' : 'text-white'}`}>{s.value}</span>
                {s.trend && (
                  <span className="text-[10px] font-bold flex items-center text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                    <span className="material-symbols-outlined text-sm">{s.trend === 'up' ? 'trending_up' : 'arrow_upward'}</span>
                    {s.trend === 'up' ? '1.2%' : '2'}
                  </span>
                )}
              </div>
              <p className={`text-[10px] mt-2 ${s.isError ? 'text-red-400/60' : 'text-on-surface-variant/40'}`}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.name} className={`bg-surface-container p-6 rounded-2xl relative group hover:bg-surface-container-high transition-all border ${m.risk ? 'border-red-500/30' : 'border-white/5'
              }`}>
              {m.risk && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest animate-pulse">At Risk</div>
              )}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-white/10 flex items-center justify-center text-lg font-bold text-white">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-primary-container transition-colors">{m.name}</h3>
                  <p className="text-xs text-on-surface-variant">{m.role}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Completion</span>
                  <span className="text-2xl font-bold" style={{ color: m.statusColor }}>{m.rate}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${m.rate}%`, backgroundColor: m.statusColor }}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                  <div className="text-center">
                    <span className="block text-lg font-bold text-white">{m.done}</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Done</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-white">{m.open}</span>
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Open</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-white" style={{ color: m.overdue > 0 ? '#F87171' : 'inherit' }}>{m.overdue}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${m.overdue > 0 ? 'text-red-400' : 'text-on-surface-variant'}`}>Overdue</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Panel */}
      <aside className="w-full xl:w-[320px] bg-surface-container border-l border-white/5 p-8 flex flex-col h-fit sticky top-0 rounded-2xl xl:rounded-none">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Escalation Alerts</h2>
          <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-red-500/20">7 active</span>
        </div>

        <div className="space-y-6">
          {escalations.map((e) => (
            <div key={e.name} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">
                  {e.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-bold text-white">{e.name}</span>
                  <p className="text-[10px] text-red-400 font-bold uppercase mt-0.5">{e.alert}</p>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{e.detail}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-red-500 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">Send Reminder</button>
                <button className="bg-white/5 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">Schedule 1:1</button>
              </div>
            </div>
          ))}

          <div className="bg-surface-container-high rounded-2xl p-6 border border-white/5">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-4">Recent Trends</span>
            <div className="space-y-4">
              {[
                { label: "Resolved Alerts", value: "12", color: "text-emerald-400" },
                { label: "Escalation Velocity", value: "+14%", color: "text-primary-container" },
                { label: "Avg Resolve Time", value: "1.4 days", color: "text-white" }
              ].map(t => (
                <div key={t.label} className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">{t.label}</span>
                  <span className={`text-xs font-bold ${t.color}`}>{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="w-full mt-12 py-6 flex flex-col items-center gap-2 bg-white/[0.02] rounded-2xl border border-dashed border-white/10 hover:bg-white/[0.04] transition-all">
          <span className="material-symbols-outlined text-on-surface-variant">add_circle</span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Configure Rules</span>
        </button>
      </aside>
    </div>
  );
};

export default TeamAccountabilityPage;
