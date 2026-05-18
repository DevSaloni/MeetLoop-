import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

import { useSearch } from '../context/SearchContext';

const MeetingsPage = () => {
  const { user, baseUrl } = useAuth();
  const { socket } = useNotifications();
  const navigate = useNavigate();
  const { searchQuery } = useSearch();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [user]);

  useEffect(() => {
    if (socket && meetings.length > 0) {
      const teamIds = [...new Set(meetings.map(m => m.team?._id).filter(Boolean))];
      teamIds.forEach(id => socket.emit('join_team', id));

      socket.on('meeting_list_update', () => {
        const fetchAgain = async () => {
          try {
            const { data } = await axios.get(`${baseUrl}/meetings`, config);
            setMeetings(data);
          } catch (err) {
            console.error('List refresh failed');
          }
        };
        fetchAgain();
      });

      return () => {
        teamIds.forEach(id => socket.emit('leave_team', id));
        socket.off('meeting_list_update');
      };
    }
  }, [socket, meetings.length]);

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/meetings`, config);
      setMeetings(data);
    } catch (err) {
      toast.error('Failed to load meetings');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeeting = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-xs font-bold text-white">Delete this meeting and all tasks?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`${baseUrl}/meetings/${id}`, config);
                toast.success('Meeting deleted successfully');
                setMeetings(meetings.filter(m => m._id !== id));
              } catch (err) {
                toast.error('Failed to delete meeting');
              }
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center', style: { minWidth: '300px' } });
  };



  // Filter logic
  const filteredMeetings = meetings.filter(m => {
    // Search match
    const searchMatch = !searchQuery || 
      (m.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (m.team?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    if (!searchMatch) return false;

    if (filter === 'All') return true;
    
    const meetingDate = new Date(m.date);
    const now = new Date();
    
    if (filter === 'This Week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return meetingDate >= weekAgo;
    }
    
    if (filter === 'This Month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return meetingDate >= monthAgo;
    }

    return true;
  });

  return (
    <div className="animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-3" style={{ fontFamily: 'Space Grotesk' }}>Meetings</h1>
          <p className="text-[13px] md:text-base text-on-surface-variant font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-sm">event_note</span>
            <span className="hidden sm:inline">You have access to </span>
            <span className="text-primary-container font-black">{meetings.length}</span> meetings.
          </p>
        </div>

        {user?.role === 'Team Lead' && (
          <Link
            to="/app/new-meeting"
            className="w-full md:w-auto btn-primary-premium flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-sm md:text-base">add</span>
            New Meeting
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 overflow-x-auto custom-scrollbar whitespace-nowrap">
        <div className="flex gap-6 md:gap-10">
          {['All', 'This Week', 'This Month'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${filter === f ? 'text-primary-container border-b-2 border-primary-container font-black' : 'text-on-surface-variant hover:text-white'} transition-all pb-3 px-1 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold shrink-0`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-surface-container border border-white/5 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-20 bg-white/5 rounded-full" />
                  <div className="h-5 w-3/4 bg-white/5 rounded-lg" />
                </div>
                <div className="w-16 h-6 bg-white/5 rounded-full" />
              </div>
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-2/3 bg-white/5 rounded" />
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3].map(j => <div key={j} className="w-6 h-6 rounded-full bg-white/5 border-2 border-surface-container" />)}
                </div>
                <div className="h-3 w-16 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-[#111113]/50 rounded-3xl border border-dashed border-white/10 group hover:border-primary-container/20 transition-all">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">calendar_today</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center" style={{ fontFamily: 'Space Grotesk' }}>No Team Meetings Yet</h3>
          <p className="text-sm md:text-base text-on-surface-variant text-center mb-10 max-w-[450px] mx-auto leading-relaxed">
            Keep your team accountable by recording your first meeting and letting AI extract the commitments.
          </p>
          {user?.role === 'Team Lead' && (
            <Link
              to="/app/new-meeting"
              className="btn-primary-premium flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-xl"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Create Meeting
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredMeetings.map((meeting) => {
            const allTasksDone = !meeting.tasks?.length || (meeting.taskStats?.done === meeting.tasks?.length);

            const status = !meeting.aiProcessed
              ? { text: 'ACTION REQ.', dot: 'bg-rose-500', shadow: 'rgba(244,63,94,0.5)', bg: 'bg-rose-500/10', textCls: 'text-rose-400', border: 'border-rose-500/20' }
              : new Date(meeting.date) > new Date()
                ? { text: 'UPCOMING', dot: 'bg-blue-500', shadow: 'rgba(59,130,246,0.5)', bg: 'bg-blue-500/10', textCls: 'text-blue-400', border: 'border-blue-500/20' }
                : allTasksDone
                  ? { text: 'COMPLETED', dot: 'bg-emerald-500', shadow: 'rgba(16,185,129,0.5)', bg: 'bg-emerald-500/10', textCls: 'text-emerald-400', border: 'border-emerald-500/20' }
                  : { text: 'IN PROGRESS', dot: 'bg-orange-500', shadow: 'rgba(249,115,22,0.5)', bg: 'bg-orange-500/10', textCls: 'text-orange-400', border: 'border-orange-500/20' };

            const attendees = meeting.tasks?.reduce((acc, task) => {
              if (task.assignedTo && !acc.find(a => a._id === task.assignedTo._id)) {
                acc.push(task.assignedTo);
              }
              return acc;
            }, []) || [];

            return (
              <div key={meeting._id} className="bg-[#111113] border border-white/5 hover:border-primary-container/30 rounded-2xl p-4 md:p-5 flex flex-col gap-4 transition-all duration-300 group shadow-lg shadow-black/20 relative">
                {/* Status Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${status.dot} shadow-[0_0_8px_${status.shadow}]`}></span>
                    <span className="text-[9px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{meeting.meetingType || 'General Sync'}</span>
                  </div>
                  <span className={`${status.bg} ${status.textCls} border ${status.border} px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black tracking-widest whitespace-nowrap`}>
                    {status.text}
                  </span>
                </div>

                {/* Content */}
                <div className="min-h-[40px] md:min-h-[45px]">
                  <h3 className="text-base md:text-lg font-bold text-white mb-1 leading-tight group-hover:text-primary-container transition-colors" style={{ fontFamily: 'Space Grotesk' }}>{meeting.title}</h3>
                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[10px]">groups</span>
                    {meeting.team?.name || 'Unassigned'}
                  </div>
                </div>

                {/* Attendees and Time */}
                <div className="flex justify-between items-center py-2 border-y border-white/5">
                  <div className="flex -space-x-1.5">
                    {attendees.slice(0, 3).map((attendee, idx) => (
                      <div key={attendee._id || idx} className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-[#111113] bg-surface-container-high flex items-center justify-center text-[7px] md:text-[8px] font-black text-white overflow-hidden shadow-xl">
                        {attendee.profilePic ? (
                           <img src={attendee.profilePic} alt={attendee.name} className="w-full h-full object-cover" />
                        ) : (
                          attendee.name?.charAt(0)?.toUpperCase()
                        )}
                      </div>
                    ))}
                    {attendees.length > 3 && (
                      <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/5 border-2 border-[#111113] flex items-center justify-center text-[7px] md:text-[8px] font-black text-on-surface-variant">
                        +{attendees.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">
                      {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Tasks Module */}
                <div className="bg-white/[0.02] rounded-xl p-3 md:p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-2 md:mb-3">
                    <span className="text-[8px] md:text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Tasks Overview</span>
                    <span className="text-primary-container font-black text-xs md:text-sm">{meeting.tasks?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="text-[7px] md:text-[8px] font-black text-on-surface-variant/60 uppercase tracking-widest">OPEN</span>
                      <span className="text-xs md:text-sm font-bold text-white">{meeting.taskStats?.open || 0}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] md:text-[8px] font-black text-on-surface-variant/60 uppercase tracking-widest">DONE</span>
                      <span className="text-xs md:text-sm font-bold text-emerald-400">{meeting.taskStats?.done || 0}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[7px] md:text-[8px] font-black text-on-surface-variant/60 uppercase tracking-widest">OVERDUE</span>
                      <span className="text-xs md:text-sm font-bold text-rose-500">{meeting.taskStats?.blocked || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Assignment Indicator for Contributors */}
                {user?.role === 'Contributor' && meeting.tasks?.some(t => t.assignedTo?._id === user?._id) && (
                  <div className="absolute top-0 right-0 bg-primary-container text-white text-[8px] md:text-[9px] font-black uppercase tracking-tighter px-3 md:px-4 py-1 rounded-bl-xl shadow-lg">
                    Task Assigned
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/app/meetings/${meeting._id}`}
                  className="w-full bg-white/5 hover:bg-primary-container text-white py-3 md:py-3.5 rounded-xl font-black text-center text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all group-hover:shadow-lg group-hover:shadow-primary-container/20"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;
