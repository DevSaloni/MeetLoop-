import React, { useState } from 'react';

const DashboardPage = () => {
  const [role, setRole] = useState('contributor'); // 'contributor' or 'lead'

  const memberMetrics = [
    { label: "Active Tasks", value: "08", sub: "Assigned to me", icon: "assignment", color: "#60A5FA", progress: "40%" },
    { label: "Action Needed", value: "03", sub: "Confirm Agreements", icon: "handshake", color: "#FBBF24", progress: "70%", isError: true },
    { label: "My Reliability", value: "94%", sub: "+2% vs avg", icon: "verified", color: "#4ADE80", progress: "94%" },
    { label: "Overdue", value: "02", sub: "Immediate Action", icon: "warning", color: "#F87171", progress: "90%", isError: true }
  ];

  const leadMetrics = [
    { label: "Team Stalls", value: "07", sub: "Blocked Tasks", icon: "report", color: "#F87171", progress: "15%", isError: true },
    { label: "Org Reliability", value: "88%", sub: "Team Average", icon: "speed", color: "#4ADE80", progress: "88%" },
    { label: "Hours Saved", value: "124h", sub: "Via AI Extraction", icon: "auto_awesome", color: "#60A5FA", progress: "75%" },
    { label: "Open Loops", value: "12", sub: "Pending Confirmation", icon: "sync", color: "#FBBF24", progress: "45%" }
  ];

  const recentMeetings = [
    { name: "Q3 Product Strategy Sync", date: "Oct 24, 2023", attendees: ["JD", "ML", "AR"], tasks: "08 / 12", status: "ACTIVE", statusColor: "#FBBF24" },
    { name: "Weekly Growth Sprint", date: "Oct 22, 2023", attendees: ["SM", "+2"], tasks: "05 / 05", status: "CLOSED", statusColor: "#4ADE80" },
    { name: "Design Critique: Landing Page", date: "Oct 20, 2023", attendees: ["FK", "TP"], tasks: "03 / 06", status: "OVERDUE", statusColor: "#F87171" }
  ];

  const personalTasks = [
    { title: "Finalize Q3 Slide Deck", from: "Product Strategy Sync", due: "Today", urgency: "high" },
    { title: "Review API Documentation", from: "Tech Review", due: "Tomorrow", urgency: "medium" },
    { title: "Confirm Design Handoff", from: "UI Sync", due: "Friday", urgency: "low" }
  ];

  const teamRisks = [
    { title: "Sarah: DB Migration", from: "Arch Review", issue: "Blocked by API Docs", urgency: "high" },
    { title: "Mike: Stripe Integration", from: "Sprint Sync", issue: "Unconfirmed for 2 days", urgency: "medium" },
    { title: "Organization: Loop Drift", from: "System Alert", issue: "3 tasks unconfirmed", urgency: "low" }
  ];

  const metrics = role === 'contributor' ? memberMetrics : leadMetrics;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            {role === 'contributor' ? 'My Workspace' : 'Team Command Center'}
          </h2>
          <p className="text-on-surface-variant font-medium">Good morning, Alex. Here is what needs your attention.</p>
        </div>

        {/* Mock Role Switcher for Demo */}
        <div className="bg-surface-container-high p-1 rounded-2xl border border-white/5 flex gap-1">
          <button
            onClick={() => setRole('contributor')}
            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'contributor' ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20' : 'text-on-surface-variant hover:text-white'}`}
          >
            Contributor
          </button>
          <button
            onClick={() => setRole('lead')}
            className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${role === 'lead' ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20' : 'text-on-surface-variant hover:text-white'}`}
          >
            Team Lead
          </button>
        </div>
      </div>

      {/* Role-Specific Alert */}
      {role === 'contributor' ? (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
              <span className="material-symbols-outlined fill-1">warning</span>
            </div>
            <span className="text-sm text-red-100">
              You have <strong className="font-bold">2 high-priority tasks</strong> due today.
            </span>
          </div>
          <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
            Resolve Now
          </button>
        </div>
      ) : (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
              <span className="material-symbols-outlined fill-1">trending_down</span>
            </div>
            <span className="text-sm text-amber-100">
              Team velocity dropped <strong className="font-bold">12%</strong> this week. 3 tasks are stalled.
            </span>
          </div>
          <button className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
            Analyze Risk
          </button>
        </div>
      )}

      {/* Dynamic Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-surface-container border border-white/5 p-6 rounded-2xl hover:border-primary-container/30 transition-all group relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[100px] text-white">{m.icon}</span>
            </div>
            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{m.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg" style={{ color: m.color }}>{m.icon}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-4xl font-bold ${m.isError ? 'text-red-500' : 'text-white'}`} style={{ fontFamily: 'Space Grotesk' }}>{m.value}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${m.isError ? 'text-red-500/70' : 'text-on-surface-variant'}`}>{m.sub}</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: m.progress, backgroundColor: m.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Context Dependent */}
        <div className="lg:col-span-8 bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
              {role === 'contributor' ? 'Recent Assignments' : 'Team Activity Feed'}
            </h3>
            <button className="text-[10px] font-bold text-primary-container hover:underline uppercase tracking-widest">View Archives</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Source Meeting</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{role === 'contributor' ? 'Collaborators' : 'Owners'}</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Progress</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentMeetings.map((meeting) => (
                  <tr key={meeting.name} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5 text-sm font-bold text-white group-hover:text-primary-container transition-colors leading-tight">{meeting.name}</td>
                    <td className="px-6 py-5 text-[10px] font-bold text-on-surface-variant uppercase">{meeting.date}</td>
                    <td className="px-6 py-5">
                      <div className="flex -space-x-2">
                        {meeting.attendees.map((at, i) => (
                          <div key={i} className="w-7 h-7 rounded-lg border-2 border-surface-container bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
                            {at}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-on-surface-variant">{meeting.tasks}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="px-3 py-1 rounded-lg text-[9px] font-bold border uppercase tracking-widest" style={{
                        backgroundColor: `${meeting.statusColor}10`,
                        color: meeting.statusColor,
                        borderColor: `${meeting.statusColor}20`
                      }}>
                        {meeting.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section: Priority Focus */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="mb-8 border-b border-white/5 pb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'contributor' ? 'My Next Steps' : 'Operational Risks'}
              </h3>
              <span className="material-symbols-outlined text-primary-container">
                {role === 'contributor' ? 'assignment_turned_in' : 'emergency_home'}
              </span>
            </div>

            <div className="space-y-6">
              {(role === 'contributor' ? personalTasks : teamRisks).map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.urgency === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-amber-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white group-hover:text-primary-container transition-colors">
                      {role === 'contributor' ? item.title : item.title}
                    </p>
                    <p className="text-[10px] font-medium text-on-surface-variant mt-1 leading-relaxed">
                      {role === 'contributor' ? `From: ${item.from}` : `Issue: ${item.issue}`}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${item.urgency === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                        {role === 'contributor' ? item.due : item.from}
                      </span>
                      <button className="text-[9px] font-bold text-on-surface-variant hover:text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {role === 'contributor' ? 'Finish' : 'Intervene'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-on-surface-variant hover:text-white transition-all uppercase tracking-widest">
              {role === 'contributor' ? 'View All Tasks' : 'Open Risk Report'}
            </button>
          </div>

          {/* Contextual Action Card */}
          <div className="bg-gradient-to-br from-primary-container to-orange-600 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'contributor' ? 'Boost Reliability' : 'Add New Data'}
              </h4>
              <p className="text-xs text-white/80 mb-6 leading-relaxed">
                {role === 'contributor'
                  ? 'Complete your high-priority tasks to improve your reliability score by 4.2%.'
                  : 'Start a new AI extraction to keep the team loop active and up to date.'}
              </p>
              <button className="bg-white text-primary-container px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl">
                {role === 'contributor' ? 'Finish Top Task' : 'New Meeting'}
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[140px] text-white opacity-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
              {role === 'contributor' ? 'verified' : 'auto_awesome'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
