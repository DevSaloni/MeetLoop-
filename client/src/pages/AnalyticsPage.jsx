import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const { user, baseUrl } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [meetingsRes, teamsRes] = await Promise.all([
          axios.get(`${baseUrl}/meetings`, config),
          axios.get(`${baseUrl}/teams`, config)
        ]);
        setMeetings(meetingsRes.data);
        setTeams(teamsRes.data?.data || []);
      } catch (err) {
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Loading Analytics...</p>
      </div>
    );
  }

  // ──────────── COMPUTE ALL METRICS FROM REAL DATA ────────────

  const allTasks = meetings.flatMap(m => m.tasks || []);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => t.status === 'done').length;
  const openTasks = allTasks.filter(t => t.status === 'open').length;
  const overdueTasks = allTasks.filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const totalDecisions = meetings.reduce((sum, m) => sum + (m.decisions?.length || 0), 0);
  const aiProcessedCount = meetings.filter(m => m.aiProcessed).length;

  // ── Meeting Type Distribution ──
  const meetingTypeMap = {};
  meetings.forEach(m => {
    const type = m.meetingType || 'Other';
    meetingTypeMap[type] = (meetingTypeMap[type] || 0) + 1;
  });
  const typeColors = [
    'bg-primary-container', 'bg-blue-400', 'bg-emerald-400', 'bg-amber-400',
    'bg-rose-400', 'bg-violet-400', 'bg-cyan-400', 'bg-pink-400'
  ];
  const meetingTypeEntries = Object.entries(meetingTypeMap)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count], i) => ({
      label,
      count,
      percentage: meetings.length > 0 ? Math.round((count / meetings.length) * 100) : 0,
      color: typeColors[i % typeColors.length]
    }));

  // ── Member Performance (Leaderboard) ──
  const memberStats = {};
  allTasks.forEach(t => {
    if (t.assignedTo && typeof t.assignedTo === 'object') {
      const id = t.assignedTo._id;
      if (!memberStats[id]) {
        memberStats[id] = {
          name: t.assignedTo.name || 'Unknown',
          role: t.assignedTo.role || 'Contributor',
          profilePic: t.assignedTo.profilePic || '',
          email: t.assignedTo.email || '',
          total: 0,
          done: 0,
          open: 0,
          overdue: 0,
          highPriority: 0
        };
      }
      memberStats[id].total++;
      if (t.status === 'done') memberStats[id].done++;
      else memberStats[id].open++;
      if (t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date()) memberStats[id].overdue++;
      if (t.priority === 'HIGH') memberStats[id].highPriority++;
    }
  });

  const leaderboard = Object.values(memberStats)
    .filter(m => m.role !== 'Team Lead')
    .map(m => ({
      ...m,
      reliability: m.total > 0 ? Math.round((m.done / m.total) * 100) : 0,
      score: (m.total > 0 ? (m.done / m.total) * 100 : 0) - (m.overdue * 5) // Punctuality penalty
    }))
    .sort((a, b) => b.score - a.score || b.done - a.done);

  // ── Weekly Task Velocity (last 7 meetings) ──
  const recentMeetings = [...meetings]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  const velocityData = recentMeetings.map((m, index, self) => {
    const total = m.tasks?.length || 0;
    const done = m.tasks?.filter(t => t.status === 'done').length || 0;
    const dateLabel = new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // If multiple meetings on same day, add a simple index
    const meetingsOnThisDay = self.filter(x => new Date(x.date).toDateString() === new Date(m.date).toDateString());
    const isDuplicateDate = meetingsOnThisDay.length > 1;
    const meetingIndex = meetingsOnThisDay.findIndex(x => x._id === m._id) + 1;
    const finalLabel = isDuplicateDate ? `${dateLabel} (${meetingIndex})` : dateLabel;

    return {
      label: finalLabel,
      fullDate: new Date(m.date).toLocaleDateString(),
      title: m.title,
      total,
      done,
      percentage: total > 0 ? Math.round((done / total) * 100) : 0
    };
  });

  // ── Top Metrics ──
  const metrics = [
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      sub: completionRate >= 80 ? "Excellent" : completionRate >= 50 ? "Good" : "Needs Focus",
      icon: "verified",
      color: completionRate >= 80 ? "#4ADE80" : completionRate >= 50 ? "#FBBF24" : "#F87171"
    },
    {
      label: "Total Tasks",
      value: totalTasks.toString().padStart(2, '0'),
      sub: `${doneTasks} Done · ${openTasks} Open`,
      icon: "assignment",
      color: "#60A5FA"
    },
    {
      label: "Meetings Held",
      value: meetings.length.toString().padStart(2, '0'),
      sub: `${aiProcessedCount} AI-Processed`,
      icon: "groups",
      color: "#A78BFA"
    },
    {
      label: "Overdue",
      value: overdueTasks.toString().padStart(2, '0'),
      sub: overdueTasks === 0 ? "All Clear" : "Need Attention",
      icon: "warning",
      color: overdueTasks > 0 ? "#F87171" : "#4ADE80",
      isError: overdueTasks > 0
    }
  ];

  // ── Priority Breakdown ──
  const highCount = allTasks.filter(t => t.priority === 'HIGH').length;
  const medCount = allTasks.filter(t => t.priority === 'MEDIUM').length;
  const lowCount = allTasks.filter(t => t.priority === 'LOW').length;

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Analytics</h1>
          <p className="text-on-surface-variant font-body-md">
            Real-time insights from <span className="text-primary-container font-bold">{meetings.length}</span> meetings across <span className="text-primary-container font-bold">{teams.length}</span> teams.
          </p>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-surface-container border border-white/5 p-6 rounded-2xl group hover:border-white/20 transition-all relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{m.label}</span>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl" style={{ color: m.color }}>{m.icon}</span>
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-4xl font-bold ${m.isError ? 'text-red-400' : 'text-white'}`} style={{ fontFamily: 'Space Grotesk' }}>{m.value}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2 font-medium">{m.sub}</p>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[80px]" style={{ color: m.color }}>{m.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Velocity Chart */}
        <div className="lg:col-span-8 bg-surface-container border border-white/5 rounded-2xl p-8 space-y-8 relative overflow-hidden group/chart">
          {/* Decorative background glow */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex justify-between items-center relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Task Completion by Meeting</h3>
              <p className="text-xs text-on-surface-variant mt-1">Showing completion rates across your recent meetings</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-container shadow-[0_0_10px_rgba(249,115,22,0.4)]"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Done</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/10"></span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total</span>
              </div>
            </div>
          </div>

          {velocityData.length === 0 ? (
            <div className="h-72 flex items-center justify-center text-on-surface-variant relative z-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <span className="material-symbols-outlined text-3xl opacity-30">bar_chart</span>
                </div>
                <p className="text-sm font-medium">No meeting data available yet</p>
                <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest mt-1">Complete meetings to see insights</p>
              </div>
            </div>
          ) : (
            <div className="h-72 w-full relative group/graph flex flex-col">
              {/* Chart Main Area */}
              <div className="flex-1 relative flex items-end">
                {/* Y-Axis Labels (Side Percentage) */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] font-bold text-on-surface-variant/30 pr-4 border-r border-white/5">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                {/* Bars Container */}
                <div className="flex-1 h-full ml-12 flex items-end justify-between px-4">
                  {velocityData.map((d, i) => {
                    const meeting = recentMeetings[i];
                    const total = meeting.tasks?.length || 0;
                    const done = meeting.tasks?.filter(t => t.status === 'done').length || 0;
                    const overdue = meeting.tasks?.filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date()).length || 0;
                    const open = total - done - overdue;

                    const donePct = total > 0 ? (done / total) * 100 : 0;
                    const overduePct = total > 0 ? (overdue / total) * 100 : 0;
                    const openPct = total > 0 ? (open / total) * 100 : 0;

                    return (
                      <div key={i} className="flex-1 max-w-[24px] group/bar relative h-full flex flex-col justify-end gap-2">
                        {/* Percentage at top */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 z-30">
                          <span className="bg-primary-container text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap">
                            {d.percentage}% Progress
                          </span>
                        </div>

                        {/* The Stacked Bar */}
                        <div className="w-full bg-white/5 rounded-t-sm overflow-hidden flex flex-col justify-end h-full transition-all duration-500 group-hover/bar:bg-white/10">
                          {/* Overdue Segment (Red) */}
                          <div 
                            className="w-full bg-red-500/80 hover:bg-red-500 transition-all cursor-help"
                            style={{ height: `${overduePct}%` }}
                            title={`${overdue} Overdue`}
                          ></div>
                          {/* Open/On-time Segment (Grey) */}
                          <div 
                            className="w-full bg-white/10 hover:bg-white/20 transition-all cursor-help"
                            style={{ height: `${openPct}%` }}
                            title={`${open} Open`}
                          ></div>
                          {/* Done Segment (Orange) */}
                          <div 
                            className="w-full bg-gradient-to-t from-primary-container/80 to-primary-container hover:from-primary-container transition-all cursor-help"
                            style={{ height: `${donePct}%` }}
                            title={`${done} Done`}
                          ></div>
                        </div>

                        {/* Label below bar */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-tighter whitespace-nowrap">{d.label}</span>
                          <span className="text-[7px] font-bold text-primary-container">{done}/{total}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Spacer for labels */}
              <div className="h-10"></div>
            </div>
          )}
        </div>

        {/* Meeting Type Distribution */}
        <div className="lg:col-span-4 bg-surface-container border border-white/5 rounded-2xl p-8 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Meeting Types</h3>
          <p className="text-xs text-on-surface-variant mb-6">Distribution across {meetings.length} meetings</p>

          {meetings.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm">No meetings yet</div>
          ) : (
            <>
              {/* Donut chart - completion rate */}
              <div className="flex-1 flex items-center justify-center relative mb-6">
                <div className="w-44 h-44 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `conic-gradient(
                      #f97316 0% ${completionRate}%,
                      rgba(255,255,255,0.05) ${completionRate}% 100%
                    )`
                  }}
                >
                  <div className="w-28 h-28 rounded-full bg-surface-container flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{completionRate}%</span>
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Done</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {meetingTypeEntries.slice(0, 5).map(d => (
                  <div key={d.label} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${d.color}`}></div>
                      <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors">{d.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-on-surface-variant">{d.count}</span>
                      <span className="text-xs font-bold text-white">{d.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Priority Breakdown + Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Breakdown */}
        <div className="lg:col-span-4 bg-surface-container border border-white/5 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>Priority Breakdown</h3>
          <div className="space-y-5">
            {[
              { label: 'High Priority', count: highCount, color: 'bg-red-500', textColor: 'text-red-400' },
              { label: 'Medium Priority', count: medCount, color: 'bg-primary-container', textColor: 'text-primary-container' },
              { label: 'Low Priority', count: lowCount, color: 'bg-blue-400', textColor: 'text-blue-400' }
            ].map(p => (
              <div key={p.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-on-surface-variant">{p.label}</span>
                  <span className={`text-sm font-bold ${p.textColor}`}>{p.count}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${totalTasks > 0 ? (p.count / totalTasks) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-on-surface-variant">Total Decisions Logged</span>
              <span className="text-sm font-bold text-white">{totalDecisions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-on-surface-variant">AI Extractions Used</span>
              <span className="text-sm font-bold text-white">{aiProcessedCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-on-surface-variant">Est. Hours Saved</span>
              <span className="text-sm font-bold text-emerald-400">{Math.round(aiProcessedCount * 1.5)}h</span>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-8 bg-surface-container border border-white/5 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Team Leaderboard</h3>
              <p className="text-xs text-on-surface-variant mt-1">Ranked by Reliability, Punctuality (on-time), and Volume</p>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {leaderboard.length} Members
            </span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl opacity-30 mb-2 block">emoji_events</span>
              <p className="text-sm">No task data available yet. Create meetings and assign tasks to see the leaderboard.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((m, i) => {
                const rankColors = ['text-amber-400', 'text-gray-300', 'text-amber-700'];
                const rankIcons = ['emoji_events', 'military_tech', 'workspace_premium'];

                return (
                  <div key={m.name + i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary-container/30 transition-all group">
                    <div className="flex items-center gap-5">
                      {/* Rank */}
                      <div className="w-8 text-center">
                        {i < 3 ? (
                          <span className={`material-symbols-outlined text-2xl ${rankColors[i]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                            {rankIcons[i]}
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-white/20">{String(i + 1).padStart(2, '0')}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-surface-container-high border-2 border-white/10 flex items-center justify-center font-bold text-white overflow-hidden shadow-md">
                        {m.profilePic ? (
                          <img src={m.profilePic} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-base">{m.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      {/* Name + Email */}
                      <div>
                        <h4 className="font-bold text-white text-sm">{m.name}</h4>
                        <p className="text-[10px] text-on-surface-variant">{m.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {/* Stats */}
                      <div className="text-center hidden md:block">
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">Done</span>
                        <p className="text-lg font-bold text-emerald-400">{m.done}</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">Open</span>
                        <p className="text-lg font-bold text-white/50">{m.open}</p>
                      </div>
                      {m.overdue > 0 && (
                        <div className="text-center hidden md:block">
                          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">Overdue</span>
                          <p className="text-lg font-bold text-red-400">{m.overdue}</p>
                        </div>
                      )}
                      {/* Reliability */}
                      <div className="flex flex-col items-end min-w-[80px]">
                        <span className={`text-2xl font-bold ${m.reliability >= 80 ? 'text-emerald-400' : m.reliability >= 50 ? 'text-amber-400' : 'text-red-400'}`} style={{ fontFamily: 'Space Grotesk' }}>
                          {m.reliability}%
                        </span>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${m.reliability >= 80 ? 'bg-emerald-400' : m.reliability >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${m.reliability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
