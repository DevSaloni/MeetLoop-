import React from 'react';

const MeetingsPage = () => {
  const meetings = [
    {
      id: 1,
      tag: "Q3 Product Strategy",
      status: "COMPLETED",
      statusColor: "#10B981",
      title: "System Architecture Review",
      project: "MeetLoop Core",
      attendees: ["JD", "ML", "AR", "+2"],
      date: "Oct 12, 2023",
      time: "10:00 AM - 11:30 AM",
      tasks: 12,
      open: 2,
      done: 10,
      overdue: 0
    },
    {
      id: 2,
      tag: "Engineering Sync",
      status: "UPCOMING",
      statusColor: "#3B82F6",
      title: "Weekly Infrastructure Sync",
      project: "DevOps Pipeline",
      attendees: ["AE", "SD"],
      date: "Oct 15, 2023",
      time: "02:00 PM - 03:00 PM",
      tasks: 5,
      open: 5,
      done: 0,
      overdue: 0
    },
    {
      id: 3,
      tag: "Design Review",
      status: "ACTION REQ.",
      statusColor: "#F43F5E",
      title: "Dashboard Redesign Handoff",
      project: "UI Refresh",
      attendees: ["SL", "MT"],
      date: "Oct 10, 2023",
      time: "11:00 AM - 12:00 PM",
      tasks: 8,
      open: 3,
      done: 2,
      overdue: 3
    },
    {
      id: 4,
      tag: "Customer Success",
      status: "COMPLETED",
      statusColor: "#10B981",
      title: "Enterprise Onboarding: Acme Corp",
      project: "Customer Retention",
      attendees: ["CM", "+8"],
      date: "Oct 09, 2023",
      time: "04:00 PM - 05:00 PM",
      tasks: 15,
      open: 0,
      done: 15,
      overdue: 0
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Meetings</h1>
          <p className="text-on-surface-variant font-body-md">
            You have <span className="text-primary-container font-bold">24</span> meetings scheduled for this month.
          </p>
        </div>
        <button className="bg-primary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-container/20 uppercase tracking-wider text-xs">
          <span className="material-symbols-outlined text-lg">add</span>
          New Meeting
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex gap-8">
          <button className="text-primary-container font-bold border-b-2 border-primary-container pb-2 px-1 text-sm uppercase tracking-widest">All</button>
          <button className="text-on-surface-variant font-body-md hover:text-white transition-colors pb-2 px-1 text-sm uppercase tracking-widest">This Week</button>
          <button className="text-on-surface-variant font-body-md hover:text-white transition-colors pb-2 px-1 text-sm uppercase tracking-widest">This Month</button>
          <button className="text-on-surface-variant font-body-md hover:text-white transition-colors pb-2 px-1 flex items-center gap-1 text-sm uppercase tracking-widest">
            By Project
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-surface-container-high rounded-md text-white border border-white/5">
            <span className="material-symbols-outlined text-lg">grid_view</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-md transition-all">
            <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
          </button>
        </div>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="bg-surface-container border border-white/5 rounded-xl p-6 flex flex-col gap-6 hover:border-white/20 transition-all group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{
                  backgroundColor: meeting.statusColor,
                  boxShadow: `0 0 8px ${meeting.statusColor}80`
                }}></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{meeting.tag}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold border" style={{
                backgroundColor: `${meeting.statusColor}10`,
                color: meeting.statusColor,
                borderColor: `${meeting.statusColor}20`
              }}>
                {meeting.status}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-primary-container transition-colors" style={{ fontFamily: 'Space Grotesk' }}>{meeting.title}</h3>
              <p className="text-xs text-on-surface-variant mt-1">Project: {meeting.project}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex -space-x-2">
                {meeting.attendees.map((at, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-container bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-white">
                    {at}
                  </div>
                ))}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">{meeting.date}</p>
                <p className="text-[10px] text-on-surface-variant">{meeting.time}</p>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg p-4 border border-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tasks Extracted</span>
                <span className="text-primary-container font-bold">{meeting.tasks}</span>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">OPEN</span>
                  <span className="text-sm font-bold text-white">{meeting.open}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">DONE</span>
                  <span className="text-sm font-bold text-emerald-400">{meeting.done}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">OVERDUE</span>
                  <span className="text-sm font-bold text-red-400">{meeting.overdue}</span>
                </div>
              </div>
            </div>

            <button className="w-full py-3 border border-white/10 hover:bg-white/5 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsPage;
