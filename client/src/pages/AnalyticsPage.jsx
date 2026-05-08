import React from 'react';

const AnalyticsPage = () => {
  const metrics = [
    { label: "Efficiency Score", value: "92", sub: "Very High", color: "#4ADE80", trend: "+4%" },
    { label: "Commitment Velocity", value: "14.2", sub: "Tasks/Week", color: "#60A5FA", trend: "+1.5" },
    { label: "Avg Response Time", value: "4.8h", sub: "Confirmations", color: "#FBBF24", trend: "-12%" },
    { label: "Project Health", value: "88%", sub: "On Track", color: "#A78B7D", trend: "+2%" }
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Analytics</h1>
          <p className="text-on-surface-variant font-body-md">Deep insights into team performance and execution velocity.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container p-1 rounded-xl border border-white/5">
          {['Last 7 Days', '30 Days', '90 Days'].map(t => (
            <button key={t} className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              t === '30 Days' ? 'bg-primary-container text-white shadow-lg' : 'text-on-surface-variant hover:text-white'
            }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-surface-container border border-white/5 p-6 rounded-2xl group hover:border-white/20 transition-all relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{m.label}</span>
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-4xl font-bold text-white">{m.value}</span>
                <span className="text-xs font-bold text-emerald-400">{m.trend}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-2 uppercase tracking-widest">{m.sub}</p>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[80px]" style={{ color: m.color }}>leaderboard</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Mockup Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-surface-container border border-white/5 rounded-2xl p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Commitment Velocity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/10"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase">Assigned</span>
              </div>
            </div>
          </div>
          
          {/* Chart Mockup */}
          <div className="h-64 w-full flex items-end justify-between gap-4 pt-8">
            {[45, 62, 55, 80, 70, 90, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full bg-white/5 rounded-t-lg relative flex items-end overflow-hidden h-full">
                  <div 
                    className="w-full bg-primary-container/40 group-hover:bg-primary-container transition-all duration-700 rounded-t-lg" 
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container border border-white/5 rounded-2xl p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-8" style={{ fontFamily: 'Space Grotesk' }}>Distribution</h3>
          <div className="flex-1 flex items-center justify-center relative">
            {/* Donut Chart Mockup */}
            <div className="w-48 h-48 rounded-full border-[16px] border-white/5 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-[16px] border-primary-container border-t-transparent border-l-transparent rotate-45"></div>
              <div className="text-center">
                <span className="text-3xl font-bold text-white">74%</span>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">On Time</p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {[
              { label: "Engineering", val: "42%", color: "bg-primary-container" },
              { label: "Product", val: "28%", color: "bg-blue-400" },
              { label: "Design", val: "15%", color: "bg-emerald-400" },
              { label: "Sales", val: "15%", color: "bg-amber-400" }
            ].map(d => (
              <div key={d.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${d.color}`}></div>
                  <span className="text-xs text-on-surface-variant">{d.label}</span>
                </div>
                <span className="text-xs font-bold text-white">{d.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="bg-surface-container border border-white/5 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-8" style={{ fontFamily: 'Space Grotesk' }}>Leaderboard — Top Performers</h3>
        <div className="space-y-6">
          {[
            { name: "Sarah Jenkins", role: "Design Lead", score: 98, tasks: 42 },
            { name: "James Wilson", role: "Security Eng", score: 95, tasks: 38 },
            { name: "David Miller", role: "Backend Architect", score: 92, tasks: 45 }
          ].map((u, i) => (
            <div key={u.name} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary-container/30 transition-all group">
              <div className="flex items-center gap-6">
                <span className="text-2xl font-bold text-white/10 group-hover:text-primary-container/20 transition-colors">0{i + 1}</span>
                <div className="w-12 h-12 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center font-bold text-white">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{u.name}</h4>
                  <p className="text-xs text-on-surface-variant">{u.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Efficiency</span>
                  <p className="text-lg font-bold text-emerald-400">{u.score}%</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tasks Done</span>
                  <p className="text-lg font-bold text-white">{u.tasks}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
