import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const MeetingsPage = () => {
  const { user, baseUrl } = useAuth();
  const navigate = useNavigate();
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
    if (filter === 'All') return true;
    // Add more filters if needed
    return true;
  });

  return (
    <div className="animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>Meetings</h1>
          <p className="text-on-surface-variant font-body-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-sm">event_note</span>
            You have access to <span className="text-primary-container font-bold">{meetings.length}</span> meetings across your teams.
          </p>
        </div>

        {user?.role === 'Team Lead' && (
          <Link
            to="/app/new-meeting"
            className="btn-primary-premium flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Create New Meeting
          </Link>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex gap-10">
          {['All', 'This Week', 'This Month'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`${filter === f ? 'text-primary-container border-b-2 border-primary-container font-bold' : 'text-on-surface-variant hover:text-white'} transition-all pb-2 px-1 text-[11px] uppercase tracking-[0.2em] font-bold`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container border border-white/5 rounded-2xl h-[280px] animate-pulse"></div>
          ))}
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-surface-container/20 rounded-3xl border border-dashed border-white/10 group hover:border-primary-container/20 transition-all">
          <div className="w-16 h-14 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">calendar_today</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>No Team Meetings Yet</h3>
          <p className="text-[15px] text-on-surface-variant text-center mb-10 max-w-[450px] mx-auto leading-relaxed">
            Keep your team accountable by recording your first meeting and letting AI extract the commitments.
          </p>
          {user?.role === 'Team Lead' && (
            <Link
              to="/app/new-meeting"
              className="btn-primary-premium flex items-center gap-2 px-8 py-4 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest transition-all shadow-xl"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Create Meeting
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-md">
          {filteredMeetings.map((meeting) => {
            const allTasksDone = !meeting.tasks?.length || (meeting.taskStats?.done === meeting.tasks?.length);

            const status = !meeting.aiProcessed
              ? { text: 'ACTION REQ.', color: 'rose', dot: 'bg-rose-500', shadow: 'rgba(244,63,94,0.5)', bg: 'bg-rose-500/10', textCls: 'text-rose-400', border: 'border-rose-500/20' }
              : new Date(meeting.date) > new Date()
                ? { text: 'UPCOMING', color: 'blue', dot: 'bg-blue-500', shadow: 'rgba(59,130,246,0.5)', bg: 'bg-blue-500/10', textCls: 'text-blue-400', border: 'border-blue-500/20' }
                : allTasksDone
                  ? { text: 'COMPLETED', color: 'emerald', dot: 'bg-emerald-500', shadow: 'rgba(16,185,129,0.5)', bg: 'bg-emerald-500/10', textCls: 'text-emerald-400', border: 'border-emerald-500/20' }
                  : { text: 'IN PROGRESS', color: 'orange', dot: 'bg-orange-500', shadow: 'rgba(249,115,22,0.5)', bg: 'bg-orange-500/10', textCls: 'text-orange-400', border: 'border-orange-500/20' };

            // Get unique attendees from tasks if team members aren't directly available
            const attendees = meeting.tasks?.reduce((acc, task) => {
              if (task.assignedTo && !acc.find(a => a._id === task.assignedTo._id)) {
                acc.push(task.assignedTo);
              }
              return acc;
            }, []) || [];

            return (
              <div key={meeting._id} className="meeting-card rounded-xl p-md flex flex-col gap-md">
                {/* Status Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-xs">
                    <span className={`w-2.5 h-2.5 rounded-full ${status.dot} shadow-[0_0_8px_${status.shadow}]`}></span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">{meeting.meetingType || 'General Sync'}</span>
                  </div>
                  <span className={`${status.bg} ${status.textCls} border ${status.border} px-sm py-1 rounded-full font-label-caps text-[10px] font-bold whitespace-nowrap`}>
                    {status.text}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-h3 text-h3 text-on-surface mb-2 leading-tight" style={{ fontFamily: 'Space Grotesk' }}>{meeting.title}</h3>
                  <p className="text-body-sm text-on-surface-variant">Project: {meeting.team?.name || 'Unassigned'}</p>
                </div>

                {/* Attendees and Time */}
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {attendees.slice(0, 3).map((attendee, idx) => (
                      <img
                        key={attendee._id || idx}
                        alt={attendee.name}
                        className="w-8 h-8 rounded-full border-2 border-card"
                        src={attendee.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.name)}&background=random&color=fff`}
                      />
                    ))}
                    {attendees.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-card flex items-center justify-center text-[10px] font-bold text-on-surface">
                        +{attendees.length - 3}
                      </div>
                    )}
                    {attendees.length === 0 && (
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-card flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs text-on-surface-variant">person</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-body-sm font-semibold text-on-surface">
                      {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Tasks Module */}
                <div className="bg-surface-container-low rounded-lg p-sm border border-white/5">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Tasks Extracted</span>
                    <span className="text-primary font-bold">{meeting.tasks?.length || 0}</span>
                  </div>
                  <div className="flex gap-md">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-label-caps text-on-surface-variant">OPEN</span>
                      <span className="font-bold text-on-surface">{meeting.taskStats?.open || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-label-caps text-on-surface-variant">DONE</span>
                      <span className="font-bold text-emerald-400">{meeting.taskStats?.done || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-label-caps text-on-surface-variant">OVERDUE</span>
                      <span className="font-bold text-rose-500">{meeting.taskStats?.blocked || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/app/meetings/${meeting._id}`}
                  className="w-full border border-white/10 hover:bg-white/5 text-on-surface py-3 rounded-lg font-bold text-center text-xs uppercase tracking-widest transition-all"
                >
                  View Details
                </Link>

                {/* Assignment Indicator for Contributors */}
                {user?.role === 'Contributor' && meeting.tasks?.some(t => t.assignedTo?._id === user?._id) && (
                  <div className="absolute top-0 right-0 bg-primary-container text-white text-[9px] font-black uppercase tracking-tighter px-4 py-1 rounded-bl-xl shadow-lg">
                    Task Assigned
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;
