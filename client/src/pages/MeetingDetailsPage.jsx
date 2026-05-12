import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const { user, baseUrl } = useAuth();
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

  const sendReminder = (memberName) => {
    toast.success(`Reminder sent to ${memberName}!`, { icon: '🔔' });
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
    <div className="animate-fade-in space-y-12 pb-20 max-w-[1600px] mx-auto">
      {/* ── TOP HEADER: MEETING COMMAND CENTER ────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <Link to="/app/meetings" className="w-12 h-12 bg-surface-container border border-white/5 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all shadow-lg group/back shrink-0">
              <span className="material-symbols-outlined text-2xl group-hover/back:-translate-x-1 transition-transform">arrow_back</span>
            </Link>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container/20 to-primary-container/5 border border-primary-container/20 flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
              {meeting.team?.logo ? (
                <img src={meeting.team.logo} alt={meeting.team.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-primary-container text-3xl font-bold">groups</span>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1">
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
        </div>

        {/* Description Section */}
        {meeting.description && (
          <div className="max-w-4xl">
            <p className="text-base text-on-surface-variant/80 leading-relaxed font-medium border-l-2 border-primary-container/30 pl-6">
              {meeting.description.replace(/"/g, '')}
            </p>
          </div>
        )}

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-4 border-y border-white/5 bg-white/[0.01] px-5 rounded-xl">
          <div className="flex items-center gap-2.5 text-on-surface-variant/80">
            <span className="material-symbols-outlined text-lg text-primary-container/70">calendar_today</span>
            <span className="text-[11px] font-bold uppercase tracking-widest">
              {new Date(meeting.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-on-surface-variant/80">
            <span className="material-symbols-outlined text-lg text-primary-container/70">category</span>
            <span className="text-[11px] font-bold uppercase tracking-widest">{meeting.meetingType}</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant/80 lg:ml-auto border-l lg:border-l border-white/5 pl-8">
            <div className="w-7 h-7 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-black text-[10px] border border-primary-container/20 shadow-inner overflow-hidden">
              {meeting.createdBy?.profilePic ? (
                <img src={meeting.createdBy.profilePic} alt="" className="w-full h-full object-cover" />
              ) : (
                meeting.createdBy?.name?.charAt(0)
              )}
            </div>
            <span className="text-[11px] font-bold text-white uppercase tracking-widest">Lead: {meeting.createdBy?.name || 'Team Lead'}</span>
          </div>
        </div>
      </div>

      {/* Hero Stats Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-container border border-white/5 rounded-2xl p-10 relative overflow-hidden shadow-2xl group min-h-[220px] flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-primary-container">
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em]">AI Executive Summary</h4>
            </div>
            <p className="text-base text-white/90 leading-relaxed font-medium border-l-4 border-primary-container/30 pl-8">
              {meeting.summary ? meeting.summary.replace(/"/g, '') : "AI is still processing the outcomes of this meeting."}
            </p>
          </div>
        </div>
        <div className="lg:col-span-4 bg-surface-container border border-white/5 rounded-2xl p-10 flex flex-col justify-between shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">Team Progress</span>
            <span className="text-4xl font-black text-white">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden mb-8 border border-white/5 shadow-inner">
            <div className="bg-primary-container h-full transition-all duration-1000 shadow-[0_0_20px_rgba(249,115,22,0.4)]" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-400">{stats.done}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Done</p>
            </div>
            <div className="border-x border-white/5">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white/20">{stats.open}</p>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Open</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-10 border-b border-white/5">
        {['tasks', 'decisions', 'notes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-5 text-[10px] font-black uppercase tracking-[0.3em] relative transition-all ${activeTab === tab ? 'text-primary-container' : 'text-on-surface-variant hover:text-white'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-container rounded-t-full shadow-[0_-4px_10px_rgba(249,115,22,0.4)]"></div>}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="w-full min-h-[400px]">
            {activeTab === 'tasks' && (
              <div className="space-y-5 animate-slide-up">
                {meeting.tasks?.map(task => {
                  const isAssignee = task.assignedTo?._id === user?._id;
                  const isOverdue = task.status === 'open' && task.dueDate && new Date(task.dueDate) < new Date();

                  return (
                    <div key={task._id} className="bg-surface-container border border-white/5 rounded-2xl p-6 transition-all hover:border-primary-container/20 group relative overflow-hidden">
                      <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                        <div className="flex gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${task.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : (isOverdue ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-on-surface-variant')}`}>
                            <span className="material-symbols-outlined text-xl font-black">
                              {task.status === 'done' ? 'check' : (isOverdue ? 'event_busy' : 'radio_button_unchecked')}
                            </span>
                          </div>
                          <div className="space-y-3">
                            <p className={`text-base font-medium leading-relaxed ${task.status === 'done' ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                              {task.description}
                            </p>
                            <div className="flex items-center gap-x-4 gap-y-1">
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[9px] text-white border border-white/10 overflow-hidden">
                                  {task.assignedTo?.profilePic ? (
                                    <img src={task.assignedTo.profilePic} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    task.assignedTo?.name?.charAt(0)
                                  )}
                                </div>
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{task.assignedTo?.name || 'Unassigned'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="material-symbols-outlined text-sm text-on-surface-variant">calendar_today</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isOverdue ? 'text-red-400' : 'text-on-surface-variant'}`}>
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Flexible'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-orange-500'}`}></div>
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{task.priority}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center md:items-center justify-end gap-3 shrink-0">
                          {isAssignee ? (
                            <button
                              onClick={() => updateTaskStatus(task._id, task.status === 'done' ? 'open' : 'done')}
                              className={`w-32 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${task.status === 'done' ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600'}`}
                            >
                              {task.status === 'done' ? 'Re-open' : 'Mark Done'}
                            </button>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className={`w-28 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border flex justify-center items-center ${task.status === 'done' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-on-surface-variant'}`}>
                                {task.status}
                              </span>
                              {isLead && task.status === 'open' && (
                                <button
                                  onClick={() => sendReminder(task.assignedTo?.name)}
                                  className="w-11 h-11 bg-primary-container/10 border border-primary-container/20 text-primary-container rounded-xl flex items-center justify-center hover:bg-primary-container hover:text-white transition-all shadow-lg"
                                  title="Send Accountability Reminder"
                                >
                                  <span className="material-symbols-outlined text-xl">notifications_active</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up w-full">
                {meeting.decisions?.map((d, i) => (
                  <div key={i} className="p-8 bg-surface-container border border-white/5 rounded-2xl group hover:border-emerald-500/20 transition-all w-full relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all"></div>
                    <div>
                      <h4 className="text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-3" style={{ fontFamily: 'Space Grotesk' }}>
                        <span className="material-symbols-outlined text-emerald-400 text-2xl">verified</span> {d.title.replace(/"/g, '')}
                      </h4>
                      <p className="text-sm text-on-surface-variant/90 leading-relaxed border-l border-emerald-500/30 pl-5">{d.description.replace(/"/g, '')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="bg-surface-container border border-white/5 rounded-2xl overflow-hidden animate-slide-up w-full shadow-2xl">
                <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.25em]">Collaborative Workspace</span>
                  {isLead && !isEditingNotes && (
                    <button onClick={() => setIsEditingNotes(true)} className="px-8 py-3 bg-primary-container rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-primary-container/90 transition-all shadow-xl">
                      Edit Transcript
                    </button>
                  )}
                </div>
                <div className="p-12 pb-8">
                  {isEditingNotes ? (
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="w-full h-96 bg-background border border-white/10 rounded-xl p-8 text-base text-white/80 focus:outline-none focus:border-primary-container transition-all resize-none shadow-inner mb-6"
                      placeholder="Paste your meeting notes or transcript..."
                    />
                  ) : (
                    <p className="text-base text-on-surface-variant/90 leading-relaxed whitespace-pre-wrap font-light selection:bg-primary-container/30">
                      {meeting.notes ? meeting.notes.replace(/"/g, '') : "Historical records are empty for this meeting."}
                    </p>
                  )}
                </div>

                {/* Footer Actions Area */}
                {isLead && (
                  <div className="px-10 py-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <button
                      onClick={handleReExtract}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3.5 rounded-xl text-[11px] font-bold text-white uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl"
                    >
                      <span className="material-symbols-outlined text-xl text-primary-container">psychology</span>
                      Refresh AI Context
                    </button>

                    {isEditingNotes && (
                      <div className="flex gap-4">
                        <button onClick={handleDiscard} className="px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                          Discard
                        </button>
                        <button onClick={handleSaveNotes} className="px-10 py-3.5 bg-primary-container rounded-xl text-[11px] font-bold text-white uppercase tracking-widest hover:bg-primary-container/80 transition-all shadow-xl">
                          Save Changes
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
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-surface-container border border-white/5 rounded-2xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 blur-3xl rounded-full"></div>
            <h3 className="text-base font-bold text-white uppercase tracking-widest flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl">monitoring</span>
              Accountability
            </h3>
            <div className="space-y-8">
              {Object.values(teamInsights || {}).map((data, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-primary-container border border-white/5 overflow-hidden shadow-inner">
                        {data.profilePic ? (
                          <img src={data.profilePic} alt={data.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-xl opacity-40">person</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{data.name}</span>
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mt-0.5">
                          {data.id === meeting.createdBy?._id ? 'Team Lead' : 'Contributor'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-white">{data.done}<span className="text-on-surface-variant/30 mx-1">/</span>{data.total} <span className="text-[8px] font-bold text-on-surface-variant">DONE</span></span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="bg-primary-container h-full transition-all duration-1000 shadow-[0_0_12px_rgba(249,115,22,0.3)]" style={{ width: `${(data.done / data.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-gradient-to-br from-primary-container/10 to-transparent border border-primary-container/20 rounded-2xl p-8">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="text-white font-bold">Leader Tip:</span> Use the <span className="text-primary-container font-black">"Refresh AI Context"</span> tool after editing transcript to update the meeting's executive insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
