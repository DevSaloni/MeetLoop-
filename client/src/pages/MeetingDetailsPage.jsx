import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNotifications } from '../context/NotificationContext';
import * as mammoth from 'mammoth';

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const { user, baseUrl } = useAuth();
  const { socket } = useNotifications();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks'); // tasks, decisions, notes
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    fetchMeetingDetails();
  }, [id, user]);

  useEffect(() => {
    if (socket && id) {
      // Join meeting-specific room
      socket.emit('join_meeting', id);

      // Listen for real-time updates
      socket.on('meeting_update', (updatedMeeting) => {
        if (updatedMeeting._id === id) {
          setMeeting(updatedMeeting);
          // Optional: toast if someone else updated it
          // toast.success('Meeting updated by another user');
        }
      });

      return () => {
        socket.off('meeting_update');
        socket.emit('leave_meeting', id);
      };
    }
  }, [socket, id]);

  const fetchMeetingDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/meetings/${id}`, config);
      setMeeting(data);
      setEditedNotes(data.notes);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load meeting details');
      navigate('/app/meetings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const { data } = await axios.put(`${baseUrl}/meetings/${id}/tasks/${taskId}`, {
        status: newStatus
      }, config);
      setMeeting(data);
      toast.success(`Task status updated!`);
    } catch (err) {
      toast.error('Failed to update task status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    const loadId = toast.loading('Saving updated notes...');
    try {
      const { data } = await axios.put(`${baseUrl}/meetings/${id}`, {
        notes: editedNotes
      }, config);
      setMeeting(data);
      setIsEditingNotes(false);
      toast.success('Notes saved', { id: loadId });
    } catch (err) {
      toast.error('Failed to save notes', { id: loadId });
    }
  };

  const handleDiscard = () => {
    setEditedNotes(meeting.notes);
    setIsEditingNotes(false);
    toast.error('Changes discarded');
  };

  const handleReExtract = async () => {
    const loadId = toast.loading('🤖 AI is re-analyzing your notes...');
    try {
      const { data } = await axios.post(`${baseUrl}/meetings/${id}/extract`, {}, config);
      setMeeting(data);
      toast.success('AI insights refreshed! Task statuses were preserved.', { id: loadId });
    } catch (err) {
      toast.error('AI extraction failed', { id: loadId });
    }
  };

  const deleteMeeting = async () => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-xs font-bold text-white">Delete this meeting and all tasks permanentely?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`${baseUrl}/meetings/${id}`, config);
                toast.success('Meeting deleted successfully');
                navigate('/app/meetings');
              } catch (err) {
                toast.error('Failed to delete meeting');
              }
            }}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center', style: { background: '#131315', border: '1px solid rgba(255,255,255,0.1)', minWidth: '350px' } });
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split('.').pop().toLowerCase();
    const loadId = toast.loading(`Reading ${file.name}...`);

    try {
      if (fileType === 'txt' || fileType === 'vtt') {
        const text = await file.text();
        setEditedNotes(prev => (prev ? prev + '\n\n' + text : text));
        toast.success('File loaded successfully!', { id: loadId });
      } else if (fileType === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setEditedNotes(prev => (prev ? prev + '\n\n' + result.value : result.value));
        toast.success('Document loaded successfully!', { id: loadId });
      } else {
        toast.error('Unsupported format. Use .txt, .vtt, or .docx', { id: loadId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to read file', { id: loadId });
    }
    e.target.value = null; // reset
  };

  const sendReminder = async (taskId, memberName) => {
    try {
      await axios.post(`${baseUrl}/meetings/${id}/tasks/${taskId}/remind`, {}, config);
      toast.success(`Reminder sent to ${memberName}!`, { icon: '🔔' });
    } catch (err) {
      toast.error('Failed to send reminder');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">Synchronizing...</p>
      </div>
    );
  }

  if (!meeting) return null;

  const stats = meeting.taskStats || { total: 0, done: 0, open: 0, blocked: 0, overdue: 0 };
  const isLead = user?.role === 'Team Lead';
  const completionPercentage = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const teamInsights = meeting.tasks?.reduce((acc, task) => {
    const memberId = task.assignedTo?._id || 'unassigned';
    if (!acc[memberId]) {
      acc[memberId] = {
        name: task.assignedTo?.name || 'Unassigned',
        profilePic: task.assignedTo?.profilePic,
        id: task.assignedTo?._id,
        total: 0,
        done: 0,
        tasks: []
      };
    }
    acc[memberId].total++;
    if (task.status === 'done') acc[memberId].done++;
    acc[memberId].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in space-y-8 md:space-y-12 pb-20 max-w-[1600px] mx-auto px-1 md:px-0">
      {/* ── TOP HEADER: MEETING COMMAND CENTER ────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-4 md:gap-5 w-full lg:w-auto">
            <Link to="/app/meetings" className="w-10 h-10 md:w-12 md:h-12 bg-[#111113] border border-white/10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all shadow-lg group/back shrink-0">
              <span className="material-symbols-outlined text-xl md:text-2xl group-hover/back:-translate-x-1 transition-transform">arrow_back</span>
            </Link>

            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-primary-container/20 to-primary-container/5 border border-primary-container/20 flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
              {meeting.team?.logo ? (
                <img src={meeting.team.logo} alt={meeting.team.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-primary-container text-2xl md:text-3xl font-bold">groups</span>
              )}
            </div>

            <div className="flex-1 lg:hidden">
              <span className="text-[9px] font-black text-primary-container uppercase tracking-[0.2em] mb-0.5 block">{meeting.team?.name || 'Main Team'}</span>
              <h1 className="text-xl font-bold text-white tracking-tight leading-tight truncate max-w-[200px]" style={{ fontFamily: 'Space Grotesk' }}>
                {meeting.title}
              </h1>
            </div>
          </div>

          <div className="hidden lg:flex flex-col flex-1">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-primary-container uppercase tracking-[0.3em] mb-1">{meeting.team?.name || 'Main Team'}</span>
              {isLead && meeting.createdBy?._id === user?._id && (
                <button
                  onClick={deleteMeeting}
                  className="px-6 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete Meeting
                </button>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
              {meeting.title}
            </h1>
          </div>

          {/* Mobile Delete Button */}
          {isLead && meeting.createdBy?._id === user?._id && (
            <div className="lg:hidden w-full">
               <button
                onClick={deleteMeeting}
                className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Delete Record
              </button>
            </div>
          )}
        </div>

        {/* Description Section */}
        {meeting.description && (
          <div className="max-w-4xl">
            <p className="text-sm md:text-base text-on-surface-variant/80 leading-relaxed font-medium border-l-2 border-primary-container/30 pl-4 md:pl-6">
              {meeting.description.replace(/"/g, '')}
            </p>
          </div>
        )}

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-y-4 py-4 border-y border-white/5 bg-white/[0.01] px-4 md:px-5 rounded-xl">
          <div className="flex items-center gap-2.5 text-on-surface-variant/80 w-full sm:w-auto">
            <span className="material-symbols-outlined text-lg text-primary-container/70">calendar_today</span>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">
              {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-on-surface-variant/80 w-full sm:w-auto sm:ml-4 sm:pl-4 sm:border-l border-white/10">
            <span className="material-symbols-outlined text-lg text-primary-container/70">category</span>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">{meeting.meetingType}</span>
          </div>
          
          <div className="flex items-center gap-3 text-on-surface-variant/80 w-full lg:w-auto lg:ml-auto lg:pl-8 lg:border-l border-white/10 pt-4 lg:pt-0 border-t lg:border-t-0 mt-2 lg:mt-0">
            <div className="w-7 h-7 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-black text-[10px] border border-primary-container/20 shadow-inner overflow-hidden shrink-0">
              {meeting.createdBy?.profilePic ? (
                <img src={meeting.createdBy.profilePic} alt="" className="w-full h-full object-cover" />
              ) : (
                meeting.createdBy?.name?.charAt(0)
              )}
            </div>
            <span className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-widest truncate">Lead: {meeting.createdBy?.name || 'Team Lead'}</span>
          </div>
        </div>
      </div>

      {/* Hero Stats Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {meeting.summary && (
          <div className="lg:col-span-8 bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-10 relative overflow-hidden shadow-2xl group min-h-[180px] md:min-h-[220px] flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40"></div>
            <div className="relative z-10 space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 text-primary-container">
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">AI Executive Summary</h4>
              </div>
              <p className="text-sm md:text-base text-white/90 leading-relaxed font-medium border-l-4 border-primary-container/30 pl-6 md:pl-8">
                {meeting.summary.replace(/"/g, '')}
              </p>
            </div>
          </div>
        )}
        {!meeting.summary && (
           <div className="lg:col-span-8 bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col justify-center items-center text-center space-y-4 border-dashed opacity-60">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">psychology_alt</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">No AI Summary Generated Yet</p>
              {isLead && (
                <button onClick={handleReExtract} className="text-[9px] font-black text-primary-container hover:underline uppercase tracking-widest">
                  Generate Summary Now
                </button>
              )}
           </div>
        )}
        <div className="lg:col-span-4 bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col justify-between shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Team Progress</span>
            <span className="text-3xl md:text-4xl font-black text-white">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/5 h-2.5 md:h-3 rounded-full overflow-hidden mb-6 md:mb-8 border border-white/5 shadow-inner">
            <div className="bg-primary-container h-full transition-all duration-1000 shadow-[0_0_20px_rgba(249,115,22,0.4)]" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
            <div>
              <p className="text-xl md:text-2xl font-black text-emerald-400">{stats.done}</p>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mt-1">Done</p>
            </div>
            <div className="border-x border-white/5">
              <p className="text-xl md:text-2xl font-black text-white">{stats.total}</p>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mt-1">Items</p>
            </div>
            <div>
              <p className="text-xl md:text-2xl font-black text-white/20">{stats.open}</p>
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mt-1">Open</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-6 md:gap-10 border-b border-white/5 overflow-x-auto whitespace-nowrap custom-scrollbar">
        {['tasks', 'decisions', 'notes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] relative transition-all shrink-0 ${activeTab === tab ? 'text-primary-container' : 'text-on-surface-variant hover:text-white'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-container rounded-t-full shadow-[0_-4px_10px_rgba(249,115,22,0.4)]"></div>}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        <div className="lg:col-span-8">
          <div className="w-full min-h-[400px]">
            {activeTab === 'tasks' && (
              <div className="space-y-4 md:space-y-5 animate-slide-up">
                {meeting.tasks?.map(task => {
                  const isAssignee = task.assignedTo?._id === user?._id;
                  const isOverdue = task.status === 'open' && task.dueDate && new Date(task.dueDate) < new Date();

                  return (
                    <div key={task._id} className="bg-[#111113] border border-white/5 rounded-2xl p-5 md:p-6 transition-all hover:border-primary-container/20 group relative overflow-hidden shadow-lg">
                      <div className="flex flex-row items-center justify-between gap-4 md:gap-6 relative z-10">
                        <div className="flex gap-4 md:gap-5">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${task.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : (isOverdue ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-on-surface-variant')}`}>
                            <span className="material-symbols-outlined text-lg md:text-xl font-black">
                              {task.status === 'done' ? 'check' : (isOverdue ? 'event_busy' : 'radio_button_unchecked')}
                            </span>
                          </div>
                          <div className="space-y-3 flex-1 min-w-0">
                            <p className={`text-[15px] md:text-base font-medium leading-relaxed ${task.status === 'done' ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                              {task.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] md:text-[9px] text-white border border-white/10 overflow-hidden">
                                  {task.assignedTo?.profilePic ? (
                                    <img src={task.assignedTo.profilePic} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    task.assignedTo?.name?.charAt(0)
                                  )}
                                </div>
                                <span className="text-[9px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest truncate max-w-[80px]">{task.assignedTo?.name || 'Unassigned'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="material-symbols-outlined text-sm text-on-surface-variant">calendar_today</span>
                                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-400' : 'text-on-surface-variant'}`}>
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Flexible'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-orange-500'}`}></div>
                                <span className="text-[9px] md:text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{task.priority}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 shrink-0">
                          {isAssignee ? (
                            <button
                              onClick={() => updateTaskStatus(task._id, task.status === 'done' ? 'open' : 'done')}
                              className={`w-full md:w-32 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${task.status === 'done' ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600'}`}
                            >
                              {task.status === 'done' ? 'Re-open' : 'Mark Done'}
                            </button>
                          ) : (
                            <div className="flex items-center gap-3 w-full md:w-auto">
                              <span className={`flex-1 md:w-28 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border flex justify-center items-center ${task.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-on-surface-variant'}`}>
                                {task.status}
                              </span>
                              {isLead && task.status === 'open' && (
                                <button
                                  onClick={() => sendReminder(task._id, task.assignedTo?.name)}
                                  className="w-10 h-10 md:w-11 md:h-11 bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-xl flex items-center justify-center hover:bg-primary-container hover:text-white transition-all shadow-lg shrink-0"
                                  title="Send Reminder"
                                >
                                  <span className="material-symbols-outlined text-lg">notifications_active</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'decisions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-slide-up w-full">
                {meeting.decisions?.map((d, i) => (
                  <div key={i} className="p-6 md:p-8 bg-[#111113] border border-white/5 rounded-2xl group hover:border-emerald-500/20 transition-all w-full relative overflow-hidden flex flex-col justify-between shadow-lg">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all"></div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
                        <span className="material-symbols-outlined text-emerald-400 text-xl md:text-2xl">verified</span> {d.title.replace(/"/g, '')}
                      </h4>
                      <p className="text-[13px] md:text-sm text-on-surface-variant/90 leading-relaxed border-l border-emerald-500/30 pl-5">{d.description.replace(/"/g, '')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden animate-slide-up w-full shadow-2xl">
                <div className="px-6 md:px-10 py-5 md:py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <span className="text-[9px] md:text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Workspace Transcript</span>
                  {isLead && (
                    <div className="flex gap-3">
                      {isEditingNotes && (
                        <label className="cursor-pointer bg-white/5 border border-white/10 px-4 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm">upload_file</span>
                          Upload
                          <input type="file" accept=".txt,.vtt,.docx" className="hidden" onChange={handleFileUpload} />
                        </label>
                      )}
                      {!isEditingNotes && (
                        <button onClick={() => setIsEditingNotes(true)} className="px-6 md:px-8 py-2.5 bg-primary-container rounded-xl text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest hover:bg-primary-container/90 transition-all shadow-xl">
                          Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-10 lg:p-12">
                  {isEditingNotes ? (
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="w-full h-80 md:h-96 bg-[#09090B] border border-white/10 rounded-xl p-6 md:p-8 text-sm md:text-base text-white/80 focus:outline-none focus:border-primary-container transition-all resize-none shadow-inner mb-6"
                      placeholder="Paste your meeting notes or transcript..."
                    />
                  ) : (
                    <p className="text-sm md:text-base text-on-surface-variant/90 leading-relaxed whitespace-pre-wrap font-medium selection:bg-primary-container/30">
                      {meeting.notes ? meeting.notes.replace(/"/g, '') : "Historical records are empty for this meeting."}
                    </p>
                  )}
                </div>

                {/* Footer Actions Area */}
                {isLead && (
                  <div className="px-6 md:px-10 py-6 md:py-8 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={handleReExtract}
                      className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 px-6 md:px-8 py-3 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                      <span className="material-symbols-outlined text-lg text-primary-container">psychology</span>
                      AI Extract
                    </button>

                    {isEditingNotes && (
                      <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={handleDiscard} className="flex-1 sm:flex-none px-6 md:px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                          Discard
                        </button>
                        <button onClick={handleSaveNotes} className="flex-1 sm:flex-none px-8 md:px-10 py-3 bg-primary-container rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-primary-container/80 transition-all shadow-xl">
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: High-Level Analytics */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <section className="bg-[#111113] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full"></div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl">monitoring</span>
              Accountability Matrix
            </h3>
            <div className="space-y-6 md:space-y-8">
              {Object.values(teamInsights || {}).map((data, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-primary-container border border-white/5 overflow-hidden shadow-inner shrink-0">
                        {data.profilePic ? (
                          <img src={data.profilePic} alt={data.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-xl opacity-40">person</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-white truncate max-w-[120px]">{data.name}</span>
                        <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-[0.1em] mt-0.5">
                          {data.id === meeting.createdBy?._id ? 'Team Lead' : 'Contributor'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-white shrink-0">{data.done}<span className="text-on-surface-variant/30 mx-1">/</span>{data.total} <span className="text-[8px] font-black text-on-surface-variant opacity-40">DONE</span></span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 md:h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="bg-primary-container h-full transition-all duration-1000 shadow-[0_0_12px_rgba(249,115,22,0.3)]" style={{ width: `${(data.done / data.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-gradient-to-br from-primary-container/10 to-transparent border border-primary-container/20 rounded-2xl p-6 md:p-8">
            <p className="text-[11px] font-medium text-on-surface-variant leading-relaxed">
              <span className="text-white font-bold">Leader Tip:</span> Use <span className="text-primary-container font-black">"AI Extract"</span> after editing transcript to refresh insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
