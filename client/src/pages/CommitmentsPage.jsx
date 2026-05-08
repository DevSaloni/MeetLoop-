import React from 'react';

const CommitmentsPage = () => {
  const stats = [
    { label: "Open Commitments", value: "12", icon: "pending_actions", color: "#F97316" },
    { label: "Overdue", value: "3", icon: "priority_high", color: "#F87171", isError: true },
    { label: "Done This Week", value: "24", icon: "check_circle", color: "#4ADE80" },
    { label: "Completion Rate", value: "88%", progress: "88%", sub: "+4% from last sprint", color: "#F97316" }
  ];

  const commitmentGroups = [
    {
      title: "Product Strategy Sync",
      date: "Oct 24, 2023",
      day: "Tuesday",
      icon: "rocket_launch",
      color: "#F97316",
      tasks: [
        { id: 1, text: "Finalize Q4 roadmap visual for the board presentation", due: "Oct 26", type: "overdue", status: "Overdue" },
        { id: 2, text: "Coordinate with engineering on the new API documentation scope", due: "Oct 31", type: "open", status: "Due: Oct 31" }
      ]
    },
    {
      title: "Engineering Daily",
      date: "Oct 27, 2023",
      day: "Friday",
      icon: "terminal",
      color: "#94A3B8",
      tasks: [
        { id: 3, text: "Refactor the navigation component for responsive behavior", status: "Done", type: "done" },
        { id: 4, text: "Approve the PR for the dashboard analytics upgrade", due: "Today", type: "open", status: "Today" }
      ]
    },
    {
      title: "Design Critique",
      date: "Oct 26, 2023",
      day: "Thursday",
      icon: "palette",
      color: "#C6C6CF",
      tasks: [
        { id: 5, text: "Update the color token system for WCAG 2.1 compliance", due: "Oct 27", type: "overdue", status: "Overdue: Oct 27" }
      ]
    }
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Alex's Commitments</h1>
        <p className="text-on-surface-variant font-body-md">Track and fulfill your accountability promises across all team syncs.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-container border border-white/10 p-6 rounded-xl group hover:border-white/20 transition-all">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${s.isError ? 'text-red-400' : 'text-on-surface-variant/60'}`}>{s.label}</span>
            <div className="flex items-end justify-between mt-2">
              <span className={`text-3xl font-bold ${s.isError ? 'text-red-400' : 'text-white'}`}>{s.value}</span>
              {s.icon ? (
                <span className="material-symbols-outlined text-2xl" style={{ color: s.color }}>{s.icon}</span>
              ) : (
                <div className="text-right">
                  <span className="text-[10px] font-bold text-primary-container block mb-1">{s.value}</span>
                  <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full" style={{ width: s.progress }}></div>
                  </div>
                </div>
              )}
            </div>
            {s.sub && <p className="text-[10px] text-on-surface-variant/40 mt-2">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Tabs & Filters */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex gap-8">
          <button className="px-1 py-3 text-primary-container border-b-2 border-primary-container font-bold text-xs uppercase tracking-widest transition-all">All</button>
          <button className="px-1 py-3 text-on-surface-variant hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Open</button>
          <button className="px-1 py-3 text-on-surface-variant hover:text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
            Overdue <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold border border-red-500/20">3</span>
          </button>
          <button className="px-1 py-3 text-on-surface-variant hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Done</button>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-white uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg">filter_list</span> Filter
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-white uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg">sort</span> Sort
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {commitmentGroups.map((group) => (
          <section key={group.title} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-white/10" style={{ color: group.color }}>
                  <span className="material-symbols-outlined">{group.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight" style={{ fontFamily: 'Space Grotesk' }}>{group.title}</h3>
                  <span className="text-xs text-on-surface-variant">{group.date} • {group.day}</span>
                </div>
              </div>
              <button className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            <div className="bg-surface-container border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5">
              {group.tasks.map((task) => (
                <div key={task.id} className={`flex items-center gap-6 p-5 hover:bg-white/[0.02] transition-all border-l-4 ${
                  task.type === 'overdue' ? 'border-red-500' : (task.type === 'done' ? 'border-emerald-500 opacity-60' : 'border-transparent')
                }`}>
                  <input 
                    type="checkbox" 
                    defaultChecked={task.type === 'done'}
                    className="w-5 h-5 rounded border-white/20 bg-transparent text-primary-container focus:ring-primary-container focus:ring-offset-0" 
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.type === 'done' ? 'text-on-surface-variant line-through italic' : 'text-white'}`}>
                      {task.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
                      task.type === 'overdue' 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                        : (task.type === 'done' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-on-surface-variant')
                    }`}>
                      <span className="material-symbols-outlined text-sm">
                        {task.type === 'overdue' ? 'event_busy' : (task.type === 'done' ? 'check' : 'calendar_today')}
                      </span>
                      {task.status}
                    </span>
                    {task.type !== 'done' && (
                      <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="pt-12 text-center border-t border-white/5">
        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">MeetLoop Accountability Workspace © 2023. Focused execution on every meeting.</p>
      </footer>
    </div>
  );
};

export default CommitmentsPage;
