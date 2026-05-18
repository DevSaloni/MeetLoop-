import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const DashboardPage = () => {
  const { user, baseUrl } = useAuth();
  const { socket } = useNotifications();
  const [role, setRole] = useState(user?.role === 'Team Lead' ? 'lead' : 'contributor');
  const [meetings, setMeetings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [meetingsRes, tasksRes] = await Promise.all([
          axios.get(`${baseUrl}/meetings`, config),
          axios.get(`${baseUrl}/meetings/my-tasks`, config)
        ]);
        setMeetings(meetingsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (socket && meetings.length > 0) {
      // Get unique team IDs from meetings
      const teamIds = [...new Set(meetings.map(m => m.team?._id).filter(Boolean))];

      teamIds.forEach(id => socket.emit('join_team', id));

      socket.on('meeting_list_update', () => {
        // Simple refresh for now
        const fetchData = async () => {
          try {
            const [meetingsRes, tasksRes] = await Promise.all([
              axios.get(`${baseUrl}/meetings`, config),
              axios.get(`${baseUrl}/meetings/my-tasks`, config)
            ]);
            setMeetings(meetingsRes.data);
            setTasks(tasksRes.data);
          } catch (err) {
            console.error('Real-time refresh failed');
          }
        };
        fetchData();
      });

      return () => {
        teamIds.forEach(id => socket.emit('leave_team', id));
        socket.off('meeting_list_update');
      };
    }
  }, [socket, meetings.length]);

  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-8">
        {/* Header skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-9 w-64 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
        </div>
        {/* Metric cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-surface-container border border-white/5 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse" />
              </div>
              <div className="h-9 w-14 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/* Content rows skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-surface-container border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="h-5 w-36 bg-white/5 rounded-lg animate-pulse" />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-4 bg-surface-container border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="h-5 w-28 bg-white/5 rounded-lg animate-pulse" />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const activeTasksCount = tasks.filter(t => t.status === 'open').length;
  const overdueTasksCount = tasks.filter(t =>
    t.status === 'overdue' ||
    (t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date())
  ).length;
  const doneTasksCount = tasks.filter(t => t.status === 'done').length;
  const totalTasksCount = tasks.length;
  const reliability = totalTasksCount > 0 ? Math.round((doneTasksCount / totalTasksCount) * 100) : 100;

  // Lead Metrics
  const allTeamTasks = meetings.flatMap(m => m.tasks || []);
  const stalledTasks = allTeamTasks.filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const teamDoneTasks = allTeamTasks.filter(t => t.status === 'done').length;
  const teamTotalTasks = allTeamTasks.length;
  const orgReliability = teamTotalTasks > 0 ? Math.round((teamDoneTasks / teamTotalTasks) * 100) : 100;
  const aiProcessedMeetings = meetings.filter(m => m.aiProcessed).length;
  const hoursSaved = aiProcessedMeetings * 1.5; // Estimating 1.5 hours saved per AI extraction
  const openLoops = allTeamTasks.filter(t => t.status === 'open').length;

  const memberMetrics = [
    { label: "Active Tasks", value: activeTasksCount.toString().padStart(2, '0'), sub: "Assigned to me", icon: "assignment", color: "#60A5FA", progress: `${reliability}%` },
    { label: "Upcoming", value: tasks.filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) > new Date() && new Date(t.dueDate) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)).length.toString().padStart(2, '0'), sub: "Due in 48h", icon: "event_upcoming", color: "#FBBF24", progress: "100%" },
    { label: "My Reliability", value: `${reliability}%`, sub: reliability > 90 ? "Excellent" : "Needs Focus", icon: "verified", color: "#4ADE80", progress: `${reliability}%` },
    { label: "Overdue", value: overdueTasksCount.toString().padStart(2, '0'), sub: "Immediate Action", icon: "warning", color: "#F87171", progress: "100%", isError: overdueTasksCount > 0 }
  ];

  const leadMetrics = [
    { label: "Team Stalls", value: stalledTasks.toString().padStart(2, '0'), sub: "Overdue Tasks", icon: "report", color: "#F87171", progress: "15%", isError: stalledTasks > 0 },
    { label: "Org Reliability", value: `${orgReliability}%`, sub: "Team Average", icon: "speed", color: "#4ADE80", progress: `${orgReliability}%` },
    { label: "Hours Saved", value: `${Math.round(hoursSaved)}h`, sub: "Via AI Extraction", icon: "auto_awesome", color: "#60A5FA", progress: "100%" },
    { label: "Open Loops", value: openLoops.toString().padStart(2, '0'), sub: "Pending Tasks", icon: "sync", color: "#FBBF24", progress: "45%" }
  ];

  const metrics = role === 'contributor' ? memberMetrics : leadMetrics;

  // Format meetings for table
  const formattedMeetings = meetings.slice(0, 3).map(m => ({
    id: m._id,
    name: m.title,
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    attendees: m.tasks?.reduce((acc, t) => {
      if (t.assignedTo && !acc.find(a => a._id === t.assignedTo._id)) {
        acc.push({
          _id: t.assignedTo._id,
          name: t.assignedTo.name || 'Unknown',
          profilePic: t.assignedTo.profilePic || ''
        });
      }
      return acc;
    }, []).slice(0, 3) || [],
    tasksCount: `${m.tasks?.filter(t => t.status === 'done').length || 0} / ${m.tasks?.length || 0}`,
    status: !m.aiProcessed ? 'ACTION REQ.' : (new Date(m.date) > new Date() ? 'UPCOMING' : 'COMPLETED'),
    statusColor: !m.aiProcessed ? '#F87171' : (new Date(m.date) > new Date() ? '#60A5FA' : '#4ADE80')
  }));

  // Format personal tasks
  const personalTasks = tasks
    .filter(t => t.status === 'open')
    .slice(0, 3)
    .map(t => ({
      title: t.description,
      from: t.meeting?.title || 'Unknown Meeting',
      due: t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Flexible',
      urgency: t.priority?.toLowerCase() || 'medium'
    }));

  // Format team risks (overdue tasks for lead)
  const teamRisks = allTeamTasks
    .filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date())
    .slice(0, 3)
    .map(t => ({
      title: t.description,
      from: t.assignedTo?.name || 'Unassigned',
      issue: 'Overdue',
      urgency: 'high'
    }));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            {role === 'contributor' ? 'My Workspace' : 'Team Command Center'}
          </h2>
          <p className="text-on-surface-variant font-medium">Welcome back, {user?.name}. Here is your accountability overview.</p>
        </div>
      </div>

      {/* Role-Specific Alert */}
      {role === 'contributor' ? (
        overdueTasksCount > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined fill-1">warning</span>
              </div>
              <span className="text-sm text-red-100">
                You have <strong className="font-bold">{overdueTasksCount} overdue tasks</strong> that need immediate attention.
              </span>
            </div>
            <Link to="/app/commitments" className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
              Resolve Now
            </Link>
          </div>
        )
      ) : (
        stalledTasks > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined fill-1">report_problem</span>
              </div>
              <span className="text-sm text-amber-100">
                Team accountability is at risk: <strong className="font-bold">{stalledTasks} tasks</strong> are currently stalled or overdue.
              </span>
            </div>
            <Link to="/app/meetings" className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
              Review Meetings
            </Link>
          </div>
        )
      )}

      {/* Dynamic Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-[#111113] border border-white/5 p-5 md:p-6 rounded-2xl hover:border-primary-container/30 transition-all group relative overflow-hidden shadow-lg shadow-black/20">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <span className="material-symbols-outlined text-[80px] md:text-[100px] text-white">{m.icon}</span>
            </div>
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{m.label}</span>
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                <span className="material-symbols-outlined text-lg md:text-xl" style={{ color: m.color }}>{m.icon}</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-3xl md:text-4xl font-bold ${m.isError ? 'text-red-500' : 'text-white'}`} style={{ fontFamily: 'Space Grotesk' }}>{m.value}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${m.isError ? 'text-red-500/70' : 'text-on-surface-variant'}`}>{m.sub}</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: m.progress, backgroundColor: m.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Context Dependent */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Activity / Member Progress */}
          <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 md:p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'contributor' ? 'Recent Assignments' : 'Team Member Progress'}
              </h3>
              <Link to="/app/meetings" className="text-[10px] font-black text-primary-container hover:underline uppercase tracking-widest">
                {role === 'contributor' ? 'View All' : 'Team Detail'}
              </Link>
            </div>
            <div className="overflow-x-auto">
              {role === 'lead' ? (
                /* Lead: Member Progress Table */
                <table className="w-full text-left min-w-[500px] md:min-w-0">
                  <thead>
                    <tr className="bg-white/[0.02]">
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Member</th>
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest text-center hidden sm:table-cell">Open</th>
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest text-center">Done</th>
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Reliability</th>
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest text-right hidden md:table-cell">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(() => {
                      const memberStats = {};
                      allTeamTasks.forEach(t => {
                        if (t.assignedTo && typeof t.assignedTo === 'object') {
                          const name = t.assignedTo.name || 'Unknown';
                          if (!memberStats[name]) memberStats[name] = { open: 0, done: 0, pic: t.assignedTo.profilePic };
                          if (t.status === 'done') memberStats[name].done++;
                          else memberStats[name].open++;
                        }
                      });

                      const statsArray = Object.entries(memberStats).map(([name, stats]) => ({
                        name,
                        ...stats,
                        total: stats.open + stats.done
                      })).sort((a, b) => (b.done / b.total) - (a.done / a.total));

                      if (statsArray.length === 0) return <tr><td colSpan="5" className="p-10 text-center text-on-surface-variant italic text-xs uppercase tracking-widest">No team member data available.</td></tr>;

                      return statsArray.slice(0, 5).map((m, i) => {
                        const score = Math.round((m.done / m.total) * 100);
                        return (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                  {m.pic ? <img src={m.pic} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white">{m.name.charAt(0)}</div>}
                                </div>
                                <span className="text-sm font-bold text-white truncate max-w-[100px] md:max-w-none">{m.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center text-xs font-bold text-on-surface-variant hidden sm:table-cell">{m.open}</td>
                            <td className="px-6 py-4 text-center text-xs font-black text-emerald-400">{m.done}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden min-w-[40px] md:min-w-[60px]">
                                  <div className="h-full bg-primary-container rounded-full" style={{ width: `${score}%` }}></div>
                                </div>
                                <span className="text-[10px] font-black text-white">{score}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right hidden md:table-cell">
                              <span className={`material-symbols-outlined text-lg ${score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {score > 80 ? 'trending_up' : 'trending_flat'}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              ) : (
                /* Contributor: Recent Assignments Table */
                <table className="w-full text-left min-w-[500px] md:min-w-0">
                  <thead>
                    <tr className="bg-white/[0.02]">
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Assignment</th>
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest hidden sm:table-cell">Source</th>
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest hidden md:table-cell">Due Date</th>
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Priority</th>
                      <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tasks.slice(0, 5).map((t, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="text-[13px] font-bold text-white leading-snug line-clamp-2 max-w-[200px]">{t.description}</div>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase hidden sm:table-cell truncate max-w-[120px]">{t.meeting?.title || 'Direct Task'}</td>
                        <td className="px-6 py-4 text-[10px] font-bold text-on-surface-variant hidden md:table-cell">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No Date'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${t.priority === 'HIGH' ? 'text-red-400' : t.priority === 'MEDIUM' ? 'text-amber-400' : 'text-blue-400'}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase border tracking-widest ${t.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-on-surface-variant border-white/10'}`}>
                            {t.status}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tasks.length === 0 && <tr><td colSpan="5" className="p-12 text-center text-on-surface-variant italic text-xs uppercase tracking-widest opacity-50">You have no active assignments.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Secondary Feed: Recent Meetings (Lead) or Detailed Task Breakdown (Contributor) */}
          <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 md:p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'lead' ? 'Recent Meetings' : 'Meeting Participation'}
              </h3>
              <Link to="/app/meetings" className="text-[10px] font-black text-primary-container hover:underline uppercase tracking-widest">History</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[400px] md:min-w-0">
                <tbody className="divide-y divide-white/5">
                  {formattedMeetings.map((meeting) => (
                    <tr key={meeting.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => navigate(`/app/meetings/${meeting.id}`)}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                            <span className="material-symbols-outlined text-primary-container">calendar_today</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold text-white group-hover:text-primary-container transition-colors leading-tight truncate">{meeting.name}</div>
                            <div className="text-[9px] font-black text-on-surface-variant uppercase mt-1 tracking-widest">{meeting.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 hidden sm:table-cell">
                        <div className="flex -space-x-2">
                          {meeting.attendees.map((at, i) => (
                            <div key={at._id || i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-[#111113] bg-surface-container-high flex items-center justify-center text-[9px] font-black text-white shadow-xl overflow-hidden shrink-0">
                              {at.profilePic ? (
                                <img src={at.profilePic} alt={at.name} className="w-full h-full object-cover" />
                              ) : (
                                at.name?.charAt(0)?.toUpperCase() || '?'
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[11px] font-black text-on-surface-variant text-right tracking-widest uppercase">{meeting.tasksCount} Tasks</td>
                    </tr>
                  ))}
                  {formattedMeetings.length === 0 && <tr><td colSpan="3" className="p-12 text-center text-on-surface-variant italic text-xs uppercase tracking-widest opacity-50">No recent meetings.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section: Priority Focus */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111113] border border-white/5 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
            <div className="mb-6 md:mb-8 border-b border-white/5 pb-4 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'contributor' ? 'My Next Steps' : 'Operational Risks'}
              </h3>
              <span className="material-symbols-outlined text-primary-container text-2xl">
                {role === 'contributor' ? 'assignment_turned_in' : 'emergency_home'}
              </span>
            </div>

            <div className="space-y-4 md:space-y-6">
              {(role === 'contributor' ? personalTasks : teamRisks).length === 0 ? (
                <div className="py-10 text-center text-on-surface-variant text-[10px] font-black uppercase tracking-widest italic opacity-50">Zero Priority Items</div>
              ) : (
                (role === 'contributor' ? personalTasks : teamRisks).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group border border-transparent hover:border-white/5">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.urgency === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-amber-500'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-white group-hover:text-primary-container transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[10px] font-bold text-on-surface-variant mt-2 leading-relaxed uppercase tracking-tighter truncate opacity-70">
                        {role === 'contributor' ? `From: ${item.from}` : `Assignee: ${item.from}`}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${item.urgency === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                          {role === 'contributor' ? item.due : item.issue}
                        </span>
                        <Link to={role === 'contributor' ? "/app/commitments" : "/app/meetings"} className="text-[9px] font-black text-primary-container hover:text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          {role === 'contributor' ? 'Finish' : 'View'}
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to={role === 'contributor' ? "/app/commitments" : "/app/meetings"} className="block w-full mt-8 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-on-surface-variant hover:text-white text-center transition-all uppercase tracking-[0.2em]">
              {role === 'contributor' ? 'View All Assignments' : 'Open Reports'}
            </Link>
          </div>

          {/* Contextual Action Card */}
          <div className="bg-gradient-to-br from-primary-container to-orange-600 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-white mb-2 leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'contributor' ? 'Boost Your Reliability' : 'Add New Team Data'}
              </h4>
              <p className="text-[11px] font-medium text-white/80 mb-6 leading-relaxed max-w-[240px]">
                {role === 'contributor'
                  ? 'Complete high-priority tasks to improve your reliability score and team visibility.'
                  : 'Start a new AI extraction to keep the team loop active and identify commitments.'}
              </p>
              <Link to={role === 'contributor' ? "/app/commitments" : "/app/new-meeting"} className="inline-flex items-center gap-2 bg-white text-primary-container px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl">
                {role === 'contributor' ? 'Finish Top Task' : 'New Meeting'}
                <span className="material-symbols-outlined text-sm">rocket_launch</span>
              </Link>
            </div>
            <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[140px] text-white opacity-10 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
              {role === 'contributor' ? 'verified' : 'auto_awesome'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
