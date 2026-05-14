import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

import { useSearch } from '../context/SearchContext';

const CommitmentsPage = () => {
  const { user, baseUrl } = useAuth();
  const { searchQuery } = useSearch();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    fetchMyTasks();
  }, [user]);

  const fetchMyTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/meetings/my-tasks`, config);
      setTasks(data);
    } catch (err) {
      toast.error('Failed to load your commitments');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (meetingId, taskId, newStatus) => {
    try {
      await axios.put(`${baseUrl}/meetings/${meetingId}/tasks/${taskId}`, {
        status: newStatus
      }, config);

      setTasks(tasks.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      ));

      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  // Stats calculation
  const openCount = tasks.filter(t => t.status === 'open').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const overdueCount = tasks.filter(t => t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const completionRate = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const stats = [
    { label: "Open Commitments", value: openCount.toString(), icon: "pending_actions", color: "#F97316" },
    { label: "Overdue", value: overdueCount.toString(), icon: "priority_high", color: "#F87171", isError: overdueCount > 0 },
    { label: "Done Total", value: doneCount.toString(), icon: "check_circle", color: "#4ADE80" },
    { label: "Completion Rate", value: `${completionRate}%`, progress: `${completionRate}%`, color: "#F97316" }
  ];

  // Grouping logic
  const filteredTasks = tasks.filter(t => {
    const searchMatch = !searchQuery || 
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.meeting?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!searchMatch) return false;

    if (filter === 'Open') return t.status === 'open';
    if (filter === 'Done') return t.status === 'done';
    if (filter === 'Overdue') return t.status === 'open' && t.dueDate && new Date(t.dueDate) < new Date();
    return true;
  });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const meetingId = task.meeting._id;
    if (!acc[meetingId]) {
      acc[meetingId] = {
        title: task.meeting.title,
        date: new Date(task.meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        day: new Date(task.meeting.date).toLocaleDateString('en-US', { weekday: 'long' }),
        icon: task.meeting.meetingType === 'Sprint Planning' ? 'rocket_launch' :
          task.meeting.meetingType === 'Daily Standup' ? 'terminal' : 'groups',
        color: "#F97316",
        tasks: []
      };
    }
    acc[meetingId].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{user?.name?.split(' ')[0]}'s Commitments</h1>
        <p className="text-on-surface-variant font-body-md">Track and fulfill your accountability promises across all team syncs.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-container border border-white/10 p-6 rounded-xl group hover:border-white/20 transition-all">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${s.isError ? 'text-red-400' : 'text-on-surface-variant/60'}`}>{s.label}</span>
            <div className="flex items-end justify-between mt-2">
              <span className={`text-3xl font-bold ${s.isError ? 'text-red-400' : 'text-white'}`}>{s.value}</span>
              {s.icon && !s.progress ? (
                <span className="material-symbols-outlined text-2xl" style={{ color: s.color }}>{s.icon}</span>
              ) : (
                <div className="text-right">
                  <span className="text-[10px] font-bold text-primary-container block mb-1">{s.value}</span>
                  <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full rounded-full transition-all duration-1000" style={{ width: s.progress }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Filters */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
        <div className="flex gap-6 md:gap-8 min-w-max pr-4">
          {['All', 'Open', 'Overdue', 'Done'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-1 py-3 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all ${filter === f ? 'text-primary-container border-b-2 border-primary-container' : 'text-on-surface-variant hover:text-white'
                }`}
            >
              {f} {f === 'Overdue' && overdueCount > 0 && <span className="ml-1 bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[9px] md:text-[10px] font-bold border border-red-500/20">{overdueCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map(i => <div key={i} className="h-40 bg-surface-container border border-white/10 rounded-xl animate-pulse"></div>)}
          </div>
        ) : Object.keys(groupedTasks).length === 0 ? (
          <div className="py-20 text-center bg-surface-container/30 rounded-xl border border-dashed border-white/10">
            <p className="text-on-surface-variant text-sm italic">No {filter.toLowerCase()} commitments found.</p>
          </div>
        ) : (
          Object.entries(groupedTasks).map(([meetingId, group]) => (
            <section key={meetingId} className="space-y-4">
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
              </div>

              <div className="bg-surface-container border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5">
                {group.tasks.map((task) => {
                  const isTaskOverdue = task.status === 'open' && task.dueDate && new Date(task.dueDate) < new Date();

                  return (
                    <div key={task._id} className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-4 md:p-5 hover:bg-white/[0.02] transition-all border-l-4 ${isTaskOverdue ? 'border-red-500' : (task.status === 'done' ? 'border-emerald-500 opacity-60' : 'border-transparent')
                      }`}>
                      <div className="flex items-start gap-3 md:gap-4 md:flex-1">
                        <input
                          type="checkbox"
                          checked={task.status === 'done'}
                          onChange={() => updateTaskStatus(meetingId, task._id, task.status === 'done' ? 'open' : 'done')}
                          className="w-5 h-5 mt-0.5 md:mt-0 rounded border-white/20 bg-transparent text-primary-container focus:ring-primary-container focus:ring-offset-0 cursor-pointer shrink-0"
                        />
                        <div className="flex-1">
                          <p className={`text-sm md:text-[15px] font-medium leading-relaxed ${task.status === 'done' ? 'text-on-surface-variant line-through italic' : 'text-white'}`}>
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 pl-8 md:pl-0">
                        <span className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${isTaskOverdue
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : (task.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-on-surface-variant')
                          }`}>
                          <span className="material-symbols-outlined text-[12px] md:text-sm">
                            {isTaskOverdue ? 'event_busy' : (task.status === 'done' ? 'check' : 'calendar_today')}
                          </span>
                          {task.status === 'done' ? 'Done' : (isTaskOverdue ? 'Overdue' : `Due: ${new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`)}
                        </span>
                        {task.status !== 'done' && (
                          <button
                            onClick={() => updateTaskStatus(meetingId, task._id, 'done')}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      <footer className="pt-12 text-center border-t border-white/5">
        <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">MeetLoop Accountability Workspace © 2024. Focused execution on every meeting.</p>
      </footer>
    </div>
  );
};

export default CommitmentsPage;
