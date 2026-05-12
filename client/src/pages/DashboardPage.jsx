import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, baseUrl } = useAuth();
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Assembling Workspace...</p>
      </div>
    );
  }

  // Calculate Metrics
  const activeTasksCount = tasks.filter(t => t.status === 'open').length;
  const overdueTasksCount = tasks.filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date()).length;
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
    { label: "Action Needed", value: activeTasksCount > 0 ? "03" : "00", sub: "Confirm Agreements", icon: "handshake", color: "#FBBF24", progress: "70%", isError: activeTasksCount > 5 },
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
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Activity / Member Progress */}
          <div className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'contributor' ? 'Recent Assignments' : 'Team Member Progress'}
              </h3>
              <Link to="/app/meetings" className="text-[10px] font-bold text-primary-container hover:underline uppercase tracking-widest">
                {role === 'contributor' ? 'View All Meetings' : 'View Team Detail'}
              </Link>
            </div>
            <div className="overflow-x-auto">
              {role === 'lead' ? (
                /* Lead: Member Progress Table */
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Team Member</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Open Tasks</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Completed</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reliability</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Trend</th>
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

                      if (statsArray.length === 0) return <tr><td colSpan="5" className="p-10 text-center text-on-surface-variant italic">No team member data available.</td></tr>;

                      return statsArray.slice(0, 5).map((m, i) => {
                        const score = Math.round((m.done / m.total) * 100);
                        return (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-white/5">
                                  {m.pic ? <img src={m.pic} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white">{m.name.charAt(0)}</div>}
                                </div>
                                <span className="text-sm font-bold text-white">{m.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center text-sm font-medium text-on-surface-variant">{m.open}</td>
                            <td className="px-6 py-4 text-center text-sm font-medium text-emerald-400">{m.done}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden min-w-[60px]">
                                  <div className="h-full bg-primary-container rounded-full" style={{ width: `${score}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-white">{score}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
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
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Assignment</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Source</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Due Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Priority</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tasks.slice(0, 5).map((t, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 text-sm font-bold text-white leading-tight max-w-[200px] truncate">{t.description}</td>
                        <td className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase">{t.meeting?.title || 'Direct Task'}</td>
                        <td className="px-6 py-4 text-[10px] font-bold text-on-surface-variant">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No Date'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold uppercase tracking-widest ${t.priority === 'HIGH' ? 'text-red-400' : t.priority === 'MEDIUM' ? 'text-amber-400' : 'text-blue-400'}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${t.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-on-surface-variant border-white/10'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {tasks.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-on-surface-variant italic">You have no active assignments.</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Secondary Feed: Recent Meetings (Lead) or Detailed Task Breakdown (Contributor) */}
          <div className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'lead' ? 'Recent Meetings' : 'Meeting Participation'}
              </h3>
              <Link to="/app/meetings" className="text-[10px] font-bold text-primary-container hover:underline uppercase tracking-widest">History</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-white/5">
                  {formattedMeetings.map((meeting) => (
                    <tr key={meeting.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => window.location.href = `/app/meetings/${meeting.id}`}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <span className="material-symbols-outlined text-primary-container">calendar_today</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-primary-container transition-colors leading-tight">{meeting.name}</div>
                            <div className="text-[10px] font-bold text-on-surface-variant uppercase mt-1">{meeting.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex -space-x-2">
                          {meeting.attendees.map((at, i) => (
                            <div key={at._id || i} className="w-8 h-8 rounded-full border-2 border-surface-container bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-white shadow-xl overflow-hidden">
                              {at.profilePic ? (
                                <img src={at.profilePic} alt={at.name} className="w-full h-full object-cover" />
                              ) : (
                                at.name?.charAt(0)?.toUpperCase() || '?'
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-on-surface-variant text-right">{meeting.tasksCount} Tasks</td>
                    </tr>
                  ))}
                  {formattedMeetings.length === 0 && <tr><td colSpan="3" className="p-10 text-center text-on-surface-variant italic">No recent meetings.</td></tr>}
                </tbody>
              </table>
            </div>
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
              {(role === 'contributor' ? personalTasks : teamRisks).length === 0 ? (
                <div className="py-10 text-center text-on-surface-variant text-xs italic">No items requiring immediate focus.</div>
              ) : (
                (role === 'contributor' ? personalTasks : teamRisks).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.urgency === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-amber-500'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white group-hover:text-primary-container transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-[10px] font-medium text-on-surface-variant mt-1 leading-relaxed">
                        {role === 'contributor' ? `From: ${item.from}` : `Assignee: ${item.from}`}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${item.urgency === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
                          {role === 'contributor' ? item.due : item.issue}
                        </span>
                        <Link to={role === 'contributor' ? "/app/commitments" : "/app/meetings"} className="text-[9px] font-bold text-on-surface-variant hover:text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          {role === 'contributor' ? 'Finish' : 'View'}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to={role === 'contributor' ? "/app/commitments" : "/app/meetings"} className="block w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-on-surface-variant hover:text-white text-center transition-all uppercase tracking-widest">
              {role === 'contributor' ? 'View All Tasks' : 'Open Reports'}
            </Link>
          </div>

          {/* Contextual Action Card */}
          <div className="bg-gradient-to-br from-primary-container to-orange-600 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                {role === 'contributor' ? 'Boost Reliability' : 'Add New Data'}
              </h4>
              <p className="text-xs text-white/80 mb-6 leading-relaxed">
                {role === 'contributor'
                  ? 'Complete your high-priority tasks to improve your reliability score and team visibility.'
                  : 'Start a new AI extraction to keep the team loop active and identify new commitments.'}
              </p>
              <Link to={role === 'contributor' ? "/app/commitments" : "/app/new-meeting"} className="inline-block bg-white text-primary-container px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl">
                {role === 'contributor' ? 'Finish Top Task' : 'New Meeting'}
              </Link>
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
