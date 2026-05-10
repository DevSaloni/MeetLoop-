import React, { useState } from 'react';
import CustomSelect from '../components/ui/CustomSelect';

const NewMeetingPage = () => {
  const [notes, setNotes] = useState("");
  const [project, setProject] = useState("MeetLoop Core");
  const [tasks, setTasks] = useState([
    { id: 1, desc: "Finalize the authentication flow for the new customer portal.", owner: "Sarah Jenkins", due: "2024-05-20", priority: "HIGH" },
    { id: 2, desc: "Send the updated Q3 projections to the investment board.", owner: "David Miller", due: "2024-05-22", priority: "MEDIUM" }
  ]);

  const projects = ["MeetLoop Core", "Internal Architecture", "UI Refresh"];
  const teamMembers = ["Sarah Jenkins", "David Miller", "Mark Thompson", "Alex Rivera"];

  const handleTaskOwnerChange = (taskId, newOwner) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, owner: newOwner } : t));
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Meeting Details Card */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-container border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-container">info</span>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Meeting Info</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Meeting Title</label>
                <input
                  type="text"
                  className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 outline-none transition-all placeholder:text-on-surface-variant/20"
                  placeholder="e.g. Q3 Roadmap Planning"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Date</label>
                  <input
                    type="date"
                    className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Project</label>
                  <CustomSelect
                    options={projects}
                    value={project}
                    onChange={setProject}
                    className="h-auto"
                  />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Meeting Type</label>
                <div className="flex flex-wrap gap-2">
                  {['Strategy', 'Daily', 'Review', 'Incident'].map((type) => (
                    <span key={type} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all border ${type === 'Strategy' ? 'bg-primary-container text-white border-primary-container shadow-lg shadow-primary-container/20' : 'bg-white/5 border-white/10 text-on-surface-variant hover:border-white/30'
                      }`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* AI Instructions Tip */}
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
        <div className="lg:col-span-8">
          <section className="bg-surface-container border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary-container">notes</span>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>Notes & Transcript</h3>
              </div>
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined text-lg">upload_file</span>
                Upload
              </button>
            </div>
            <div className="flex-1">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-full min-h-[400px] bg-surface-container-low border border-white/10 rounded-2xl p-6 text-sm text-white focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 outline-none transition-all resize-none leading-relaxed placeholder:text-on-surface-variant/20 scrollbar-hide"
                placeholder="Paste your raw meeting notes or Zoom transcript here..."
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Supports: .TXT, .VTT, .DOCX</span>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Words: {notes.split(/\s+/).filter(x => x).length}</span>
            </div>
          </section>
        </div>
      </div>

      {/* AI Extraction Results */}
      <div className="space-y-8 animate-slide-up">
        <section className="bg-surface-container border border-white/5 rounded-2xl p-8 shadow-2xl overflow-hidden relative group">
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
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
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
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-6 text-sm text-white max-w-[448px] font-medium">{task.desc}</td>
                      <td className="px-6 py-6">
                        <CustomSelect
                          options={teamMembers}
                          value={task.owner}
                          onChange={(val) => handleTaskOwnerChange(task.id, val)}
                          className="w-48 h-10"
                        />
                      </td>
                      <td className="px-6 py-6">
                        <input type="date" className="bg-surface-container-low border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:ring-1 focus:ring-primary-container outline-none" defaultValue={task.due} />
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${task.priority === 'HIGH' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-primary-container/10 border-primary-container/20 text-primary-container'
                          }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button
                          onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
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
          </div>
        </section>

        {/* Decision Log Card */}
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
            <div className="p-6 bg-surface-container-low border border-white/5 rounded-2xl space-y-2 group hover:border-primary-container/30 transition-all">
              <div className="flex items-center gap-2 text-primary-container">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <p className="text-sm font-bold uppercase tracking-widest">Architectural Switch</p>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">Team agreed to migrate the database to PostgreSQL by the end of Q4 to support better scaling.</p>
            </div>
            <div className="p-6 bg-surface-container-low border border-white/5 rounded-2xl space-y-2 group hover:border-primary-container/30 transition-all">
              <div className="flex items-center gap-2 text-primary-container">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <p className="text-sm font-bold uppercase tracking-widest">Pricing Strategy</p>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">Confirmed that the legacy 'Starter' plan will be grandfathered in for existing users indefinitely.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 right-0 left-[240px] z-50">
        <div className="bg-surface-container-highest/95 backdrop-blur-2xl border-t border-white/10 p-6 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-12 ml-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tasks Found</span>
              <span className="text-3xl font-bold text-white leading-none" style={{ fontFamily: 'Space Grotesk' }}>05</span>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Decisions</span>
              <span className="text-3xl font-bold text-white leading-none" style={{ fontFamily: 'Space Grotesk' }}>02</span>
            </div>
          </div>
          <div className="flex items-center gap-8 mr-6">
            <button className="text-[10px] font-bold text-on-surface-variant hover:text-white uppercase tracking-widest transition-colors">Discard Draft</button>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-12 py-4 rounded-xl text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20">
              Confirm & Save All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMeetingPage;
