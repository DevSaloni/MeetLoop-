import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../components/ui/CustomSelect';
import CustomDatePicker from '../components/ui/CustomDatePicker';

const MEETING_TYPES = [
  "Sprint Planning",
  "Daily Standup",
  "Backlog Refinement",
  "Sprint Review",
  "Sprint Retrospective",
  "Strategy & Planning",
  "Technical Architecture",
  "Client Meeting",
  "1-on-1 Sync",
  "Other"
];

const NewMeetingPage = () => {
  const { user, baseUrl } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meetingType, setMeetingType] = useState('Daily Standup');
  const [notes, setNotes] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');

  // Data state
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  // AI extraction state
  const [extractedTasks, setExtractedTasks] = useState([]);
  const [extractedDecisions, setExtractedDecisions] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState(null);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  // Fetch user's teams on mount
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoadingTeams(true);
      try {
        const { data } = await axios.get(`${baseUrl}/teams`, config);
        setTeams(data.data);
        if (data.data && data.data.length > 0) {
          setSelectedTeamId(data.data[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load teams');
      } finally {
        setIsLoadingTeams(false);
      }
    };
    if (user) fetchTeams();
  }, [user]);

  // Update team members when team selection changes
  useEffect(() => {
    if (selectedTeamId) {
      const team = teams.find(t => t._id === selectedTeamId);
      if (team?.members) {
        setTeamMembers(team.members.map(m => ({
          _id: m.user?._id || m.user,
          name: m.user?.name || 'Unknown',
          profilePic: m.user?.profilePic || ''
        })));
      }
    }
  }, [selectedTeamId, teams]);

  // Handle AI extraction preview (No DB save yet)
  const handleExtract = async () => {
    if (!title.trim()) return toast.error('Please enter a meeting title');
    if (!selectedTeamId) return toast.error('Please select a team');
    if (!notes.trim() || notes.trim().split(/\s+/).length < 5) {
      return toast.error('Please enter meeting notes (at least a few sentences)');
    }

    setIsExtracting(true);
    const loadId = toast.loading('🤖 AI is analyzing your meeting notes...');

    try {
      // Call preview endpoint instead of creating meeting
      const { data } = await axios.post(`${baseUrl}/meetings/extract-preview`, {
        notes: notes.trim(),
        teamId: selectedTeamId
      }, config);

      setExtractedTasks(data.tasks || []);
      setExtractedDecisions(data.decisions || []);
      setIsExtracted(true);

      const taskCount = data.tasks?.length || 0;
      const decisionCount = data.decisions?.length || 0;
      toast.success(`Found ${taskCount} tasks and ${decisionCount} decisions!`, { id: loadId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Extraction failed', { id: loadId });
    } finally {
      setIsExtracting(false);
    }
  };

  // Handle saving final meeting (after review)
  const handleSave = async () => {
    setIsSaving(true);
    const loadId = toast.loading('Creating meeting and saving commitments...');
    try {
      // Final creation of meeting with ALL data
      await axios.post(`${baseUrl}/meetings`, {
        title: title.trim(),
        description: description.trim(),
        teamId: selectedTeamId,
        date,
        meetingType,
        notes: notes.trim(),
        tasks: extractedTasks.map(t => ({
          ...t,
          assignedTo: t.assignedTo?._id || t.assignedTo || null
        })),
        decisions: extractedDecisions
      }, config);

      toast.success('Meeting recorded and team notified!', { id: loadId });
      setTimeout(() => { navigate('/app/meetings'); }, 1000);
    } catch (err) {
      toast.error('Failed to save meeting', { id: loadId });
      setIsSaving(false);
    }
  };

  // Handle task field changes
  const updateTask = (index, field, value) => {
    const updated = [...extractedTasks];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedTasks(updated);
  };

  const removeTask = (index) => {
    setExtractedTasks(extractedTasks.filter((_, i) => i !== index));
  };

  // Redirect if not Team Lead
  if (user?.role !== 'Team Lead') {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">block</span>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Access Restricted</h2>
          <p className="text-on-surface-variant">Only Team Leads can create meetings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-32 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Record New Meeting</h1>
          <p className="text-on-surface-variant font-body-md">AI-powered extraction of commitments and decisions.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-container/10 border border-primary-container/20 rounded-full">
          <span className="material-symbols-outlined text-primary-container text-lg animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span className="text-[10px] font-bold text-primary-container uppercase tracking-widest">AI Extraction Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Meeting Details Card */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-surface-container border border-white/5 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-container">info</span>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Meeting Info</h3>
            </div>
            <div className="space-y-4">
              {/* Meeting Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Meeting Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 outline-none transition-all placeholder:text-on-surface-variant/20"
                  placeholder="e.g. Sprint Planning — Week 12"
                  disabled={isExtracted}
                />
              </div>

              {/* Meeting Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 outline-none transition-all placeholder:text-on-surface-variant/20 resize-none h-20"
                  placeholder="Short objective or context..."
                  disabled={isExtracted}
                />
              </div>

              {/* Date + Team */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Date</label>
                  <CustomDatePicker
                    value={date}
                    onChange={setDate}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Team</label>
                  <CustomSelect
                    options={teams.map(t => t.name)}
                    value={teams.find(t => t._id === selectedTeamId)?.name || ''}
                    onChange={(name) => {
                      const team = teams.find(t => t.name === name);
                      if (team) setSelectedTeamId(team._id);
                    }}
                    placeholder={isLoadingTeams ? "Loading teams..." : teams.length === 0 ? "No teams found" : "Select Team"}
                  />
                </div>
              </div>

              {/* Meeting Type */}
              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Meeting Type</label>
                <CustomSelect
                  options={MEETING_TYPES}
                  value={meetingType}
                  onChange={setMeetingType}
                  placeholder="Select Type"
                />
              </div>

              {/* Team Members Preview */}
              {teamMembers.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-2 block">Team Members ({teamMembers.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.map((m) => (
                      <div key={m._id} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                        <div className="w-5 h-5 rounded-full bg-surface-bright border border-white/10 flex items-center justify-center text-[8px] font-bold text-white overflow-hidden">
                          {m.profilePic ? (
                            <img src={m.profilePic} alt="" className="w-full h-full object-cover" />
                          ) : (
                            m.name?.charAt(0)?.toUpperCase()
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-on-surface-variant">{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Pro Tip */}
          <div className="bg-primary-container/5 border border-primary-container/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3 text-primary-container">
              <span className="material-symbols-outlined text-sm">lightbulb</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Pro Tip</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Mention names and deadlines directly in your notes (e.g. <span className="text-white">"Sarah to finish API docs by Friday"</span>) for 100% extraction accuracy.
            </p>
          </div>
        </div>

        {/* Editor Card */}
        <div className="lg:col-span-7">
          <section className="bg-surface-container border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">notes</span>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Notes & Transcript</h3>
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-full min-h-[400px] bg-surface-container-low border border-white/10 rounded-2xl p-6 text-sm text-white focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 outline-none transition-all resize-none leading-relaxed placeholder:text-on-surface-variant/20 scrollbar-hide"
                placeholder="Paste your raw meeting notes or Zoom transcript here..."
                disabled={isExtracted}
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Supports: .TXT, .VTT, .DOCX</span>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Words: {notes.split(/\s+/).filter(x => x).length}</span>
            </div>
          </section>
        </div>
      </div>

      {/* AI Extraction Results — Only shown after extraction */}
      {isExtracted && (
        <div className="space-y-8 animate-slide-up relative z-[60]">
          {/* Tasks Section */}
          <section className="bg-surface-container border border-white/5 rounded-2xl p-8 shadow-2xl overflow-visible relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-[120px] text-primary-container">verified</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>AI Found These Commitments</h3>
                    <p className="text-xs text-on-surface-variant">Review and adjust before saving to the workspace.</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary-container bg-primary-container/10 px-4 py-2 rounded-xl border border-primary-container/20">
                  {extractedTasks.length} Tasks
                </span>
              </div>

              {extractedTasks.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">search_off</span>
                  <p className="text-sm">No tasks were found in the meeting notes.</p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar pb-4 -mx-4 md:mx-0 px-4 md:px-0">
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Task Description</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Assigned To</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Due Date</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Priority</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {extractedTasks.map((task, index) => (
                        <tr key={task._id || index} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-5 text-sm text-white max-w-[400px] font-medium">{task.description}</td>
                          <td className="px-6 py-5">
                            <CustomSelect
                              options={[
                                { label: 'Unassigned', value: '' },
                                ...teamMembers.map(m => ({ label: m.name, value: m._id }))
                              ]}
                              value={task.assignedTo?._id || task.assignedTo || ''}
                              onChange={(val) => updateTask(index, 'assignedTo', val || null)}
                              className="w-44 !min-h-[36px]"
                            />
                          </td>
                          <td className="px-6 py-5">
                            <CustomDatePicker
                              value={task.dueDate}
                              onChange={(val) => updateTask(index, 'dueDate', val)}
                              className="w-40 !h-[36px]"
                            />
                          </td>
                          <td className="px-6 py-5">
                            <CustomSelect
                              options={[
                                { label: 'HIGH', value: 'HIGH' },
                                { label: 'MEDIUM', value: 'MEDIUM' },
                                { label: 'LOW', value: 'LOW' }
                              ]}
                              value={task.priority || 'MEDIUM'}
                              onChange={(val) => updateTask(index, 'priority', val)}
                              className="w-32 !min-h-[36px]"
                              itemClassName={task.priority === 'HIGH' ? 'text-red-400' : task.priority === 'LOW' ? 'text-blue-400' : 'text-primary-container'}
                            />
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              onClick={() => removeTask(index)}
                              className="material-symbols-outlined text-on-surface-variant hover:text-red-400 transition-colors"
                            >
                              delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Decision Log */}
          {extractedDecisions.length > 0 && (
            <section className="bg-surface-container border border-white/5 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-3xl">history_edu</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Decision Log</h3>
                  <p className="text-xs text-on-surface-variant">Permanent record of key strategic choices.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extractedDecisions.map((d, i) => (
                  <div key={i} className="p-6 bg-surface-container-low border border-white/5 rounded-2xl space-y-2 group hover:border-primary-container/30 transition-all">
                    <div className="flex items-center gap-2 text-primary-container">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <p className="text-sm font-bold uppercase tracking-widest">{d.title}</p>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{d.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-[240px] z-50">
        <div className="bg-surface-container-highest/95 backdrop-blur-2xl border-t border-white/10 p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-6 md:gap-12 w-full sm:w-auto justify-center sm:justify-start sm:ml-6">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tasks Found</span>
              <span className="text-2xl md:text-3xl font-bold text-white leading-none" style={{ fontFamily: 'Space Grotesk' }}>
                {isExtracted ? String(extractedTasks.length).padStart(2, '0') : '--'}
              </span>
            </div>
            <div className="h-8 md:h-10 w-px bg-white/10"></div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Decisions</span>
              <span className="text-2xl md:text-3xl font-bold text-white leading-none" style={{ fontFamily: 'Space Grotesk' }}>
                {isExtracted ? String(extractedDecisions.length).padStart(2, '0') : '--'}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-8 w-full sm:w-auto sm:mr-6">
            {!isExtracted ? (
              <button
                onClick={handleExtract}
                disabled={isExtracting || !title.trim() || !selectedTeamId || !notes.trim()}
                className={`flex items-center justify-center gap-3 font-bold w-full sm:w-auto px-8 md:px-12 py-3.5 md:py-4 rounded-xl text-xs md:text-sm uppercase tracking-widest transition-all shadow-xl ${isExtracting || !title.trim() || !selectedTeamId || !notes.trim()
                  ? 'bg-primary-container/50 text-white/50 cursor-not-allowed'
                  : 'btn-primary-premium text-white hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                {isExtracting ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Extracting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    Extract with AI
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsExtracted(false);
                    setExtractedTasks([]);
                    setExtractedDecisions([]);
                  }}
                  className="text-[10px] font-bold text-on-surface-variant hover:text-white uppercase tracking-widest transition-colors"
                >
                  Discard & Redo
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold w-full sm:w-auto px-8 md:px-12 py-3.5 md:py-4 rounded-xl text-xs md:text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 whitespace-nowrap"
                >
                  Confirm & Save All
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMeetingPage;
