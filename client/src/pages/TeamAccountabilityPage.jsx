import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function TeamsPage() {
  const { user, baseUrl } = useAuth();
  const { searchQuery } = useSearch();
  const { socket } = useNotifications();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'create' | 'join' | 'invite' | null
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Forms
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const authHeader = { headers: { Authorization: `Bearer ${user?.token}` } };
  const clientUrl = window.location.origin;

  const fetchTeams = useCallback(async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/teams`, authHeader);
      setTeams(data.data);
      setSelectedTeam(prevSelected => {
        if (!prevSelected) return null;
        const updated = data.data.find(t => t._id === prevSelected._id);
        return updated || prevSelected;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, user?.token]);

  const filteredTeams = teams.filter(t =>
    !searchQuery ||
    t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const codeFromUrl = queryParams.get('invite');

    if (codeFromUrl) {
      // Pre-fill the join modal instead of auto-joining
      setActiveModal('join');
      setInviteCode(codeFromUrl.toUpperCase());

      // Remove query param without refreshing
      window.history.replaceState({}, document.title, '/app/teams');
    }
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    if (socket) {
      const handleNotification = (notification) => {
        if (notification.type === 'TEAM_INVITE') {
          fetchTeams();
        }
      };

      socket.on('notification', handleNotification);

      return () => {
        socket.off('notification', handleNotification);
      };
    }
  }, [socket, fetchTeams]);

  useEffect(() => {
    if (socket && teams.length > 0) {
      const teamIds = teams.map(t => t._id);

      // Join each team room
      teamIds.forEach(id => socket.emit('join_team', id));

      const handleTeamUpdate = (data) => {
        fetchTeams();
      };

      socket.on('team_update', handleTeamUpdate);

      return () => {
        // Leave each team room and clean up listener
        teamIds.forEach(id => socket.emit('leave_team', id));
        socket.off('team_update', handleTeamUpdate);
      };
    }
  }, [socket, teams.map(t => t._id).join(','), fetchTeams]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('Image size must be less than 5MB');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return toast.error('Team name is required');
    const loadId = toast.loading('Creating team...');
    try {
      await axios.post(`${baseUrl}/teams`, { name: teamName, description: teamDesc, logo: teamLogo }, authHeader);
      toast.success('Team created!', { id: loadId });
      setActiveModal(null);
      setTeamName('');
      setTeamDesc('');
      setTeamLogo('');
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team', { id: loadId });
    }
  };

  const handleEditTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return toast.error('Team name is required');
    const loadId = toast.loading('Saving changes...');
    try {
      const { data } = await axios.put(`${baseUrl}/teams/${selectedTeam._id}`, { name: teamName, description: teamDesc, logo: teamLogo }, authHeader);
      toast.success('Team updated!', { id: loadId });
      setActiveModal(null);
      setSelectedTeam(data.data);
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update team', { id: loadId });
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return toast.error('Enter an invite code');
    const loadId = toast.loading('Joining team...');
    try {
      const { data } = await axios.post(`${baseUrl}/teams/join`, { inviteCode }, authHeader);
      toast.success(data.message, { id: loadId });
      setActiveModal(null);
      setInviteCode('');
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid invite code', { id: loadId });
    }
  };

  const handleRemoveMember = (teamId, userId, userName) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500">warning</span>
          <span className="text-sm font-semibold text-white">Remove {userName}?</span>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-white transition-colors">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadId = toast.loading('Removing...');
              try {
                const { data } = await axios.delete(`${baseUrl}/teams/${teamId}/members/${userId}`, authHeader);
                toast.success('Member removed', { id: loadId });
                setSelectedTeam(data.data);
                fetchTeams();
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed', { id: loadId });
              }
            }}
            className="px-4 py-2 text-xs font-bold bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: 'remove-confirm' });
  };

  const handleLeaveTeam = (teamId) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500">logout</span>
          <span className="text-sm font-semibold text-white">Leave this team?</span>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-white transition-colors">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadId = toast.loading('Leaving...');
              try {
                await axios.delete(`${baseUrl}/teams/${teamId}/leave`, authHeader);
                toast.success('You have left the team', { id: loadId });
                setSelectedTeam(null);
                fetchTeams();
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed', { id: loadId });
              }
            }}
            className="px-4 py-2 text-xs font-bold bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: 'leave-confirm' });
  };

  const [inviteEmail, setInviteEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleDeleteTeam = (teamId) => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[250px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500">delete_forever</span>
          <span className="text-sm font-semibold text-white">Permanently delete team?</span>
        </div>
        <p className="text-xs text-red-400/80">This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:text-white transition-colors">Cancel</button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadId = toast.loading('Deleting...');
              try {
                await axios.delete(`${baseUrl}/teams/${teamId}`, authHeader);
                toast.success('Team deleted', { id: loadId });
                setSelectedTeam(null);
                fetchTeams();
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed', { id: loadId });
              }
            }}
            className="px-4 py-2 text-xs font-bold bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: 'delete-confirm' });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return toast.error('Please enter an email address');

    setSendingEmail(true);
    const loadId = toast.loading('Sending invite email...');
    try {
      const { data } = await axios.post(`${baseUrl}/teams/${selectedTeam._id}/invite`, { email: inviteEmail }, authHeader);
      toast.success(data.message, { id: loadId });
      setInviteEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send email', { id: loadId });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleRegenerateCode = async (teamId) => {
    const loadId = toast.loading('Regenerating code...');
    try {
      const { data } = await axios.put(`${baseUrl}/teams/${teamId}/regenerate-code`, {}, authHeader);
      toast.success('Code regenerated!', { id: loadId });
      setSelectedTeam(data.data);
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to regenerate code', { id: loadId });
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
    toast.success('Copied to clipboard!');
  };

  const isCreator = (team) => team?.creator?._id === user?._id;

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-9 w-32 bg-white/5 rounded-xl animate-pulse mb-2" />
            <div className="h-4 w-56 bg-white/5 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-28 bg-white/5 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface-container border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-3 w-1/2 bg-white/5 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-3 w-4/5 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-in pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Teams</h1>
            <p className="text-base text-on-surface-variant mt-2">Manage your collaborative workspaces</p>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {user?.role === 'Contributor' && (
              <button onClick={() => setActiveModal('join')} className="btn-primary-premium flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl text-sm md:text-base font-bold text-white transition-all">
                <span className="material-symbols-outlined text-lg md:text-xl">vpn_key</span>
                Join Team
              </button>
            )}
            {user?.role === 'Team Lead' && (
              <button onClick={() => {
                setTeamName('');
                setTeamDesc('');
                setTeamLogo('');
                setActiveModal('create');
              }} className="btn-primary-premium flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl text-sm md:text-base font-bold text-white transition-all">
                <span className="material-symbols-outlined text-lg md:text-xl">add</span>
                New Team
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {teams.length === 0 && !selectedTeam ? (
          <div className="flex flex-col items-center justify-center py-12 bg-surface-container/20 rounded-3xl border border-dashed border-white/10 group hover:border-primary-container/20 transition-all">
            <div className="w-16 h-14 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">groups</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>No Teams Yet</h3>
            <p className="text-[15px] text-on-surface-variant text-center mb-10 max-w-[450px] mx-auto leading-relaxed">
              {user?.role === 'Team Lead'
                ? 'Create a collaborative workspace to start tracking tasks and decisions with your contributors.'
                : 'Ask your Team Lead for an invite code to join their workspace and start collaborating.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              {user?.role === 'Contributor' && (
                <button onClick={() => setActiveModal('join')} className="w-full sm:w-auto btn-primary-premium flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest transition-all">
                  <span className="material-symbols-outlined text-sm">vpn_key</span>
                  Enter Invite Code
                </button>
              )}
              {user?.role === 'Team Lead' && (
                <button onClick={() => {
                  setTeamName('');
                  setTeamDesc('');
                  setTeamLogo('');
                  setActiveModal('create');
                }} className="w-full sm:w-auto btn-primary-premium flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest transition-all">
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  New Team
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Team List (Left Column) */}
            <div className={`${selectedTeam ? 'lg:col-span-4' : 'lg:col-span-12'} space-y-4`}>
              {selectedTeam && (
                <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4 px-2">Your Teams</h2>
              )}
              <div className={`grid ${selectedTeam ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'} gap-5`}>
                {filteredTeams.map(team => (
                  <div
                    key={team._id}
                    onClick={() => setSelectedTeam(team)}
                    className={`bg-surface-container border rounded-2xl p-5 cursor-pointer transition-all duration-300 group ${selectedTeam?._id === team._id
                      ? 'border-primary-container shadow-[0_0_30px_rgba(249,115,22,0.15)] bg-primary-container/5 transform scale-[1.02]'
                      : 'border-white/5 hover:border-white/20 hover:shadow-xl hover:-translate-y-1'
                      }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {team.logo ? (
                          <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10" />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-container/20 to-primary-container/5 border border-primary-container/20 rounded-xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-primary-container text-xl">group_work</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[20px] font-bold text-white truncate" style={{ fontFamily: 'Space Grotesk' }}>{team.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCreator(team) && (
                              <span className="text-[10px] font-bold text-primary-container bg-primary-container/10 px-2 py-0.5 rounded-md uppercase tracking-widest border border-primary-container/20">Owner</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {team.description && (
                        <p className="text-[13px] text-on-surface-variant leading-relaxed pb-2">
                          {team.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex -space-x-2">
                          {team.members?.filter(m => m.user).slice(0, 3).map((m, i) => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-surface-container bg-surface-bright flex items-center justify-center text-[10px] font-bold text-white overflow-hidden shadow-sm">
                              {m.user?.profilePic ? (
                                <img src={m.user.profilePic} alt="" className="w-full h-full object-cover" />
                              ) : (
                                m.user?.name?.charAt(0)?.toUpperCase() || '?'
                              )}
                            </div>
                          ))}
                          {team.members?.length > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-surface-container bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                              +{team.members.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-on-surface-variant/70 uppercase tracking-widest">{team.members?.length || 0} Members</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Detail Panel (Right Column) */}
            {selectedTeam && (
              <div className="lg:col-span-8 bg-surface-container border border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-slide-in flex flex-col min-h-[600px]">

                {/* Premium Panel Header */}
                <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                      {selectedTeam.logo ? (
                        <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg shadow-black/50 shrink-0 border border-white/10" />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-container to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-container/20 shrink-0">
                          <span className="material-symbols-outlined text-white text-3xl">workspaces</span>
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1" style={{ fontFamily: 'Space Grotesk' }}>{selectedTeam.name}</h2>
                        {selectedTeam.description && <p className="text-sm text-on-surface-variant max-w-[400px] leading-relaxed">{selectedTeam.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isCreator(selectedTeam) && (
                        <button onClick={() => {
                          setTeamName(selectedTeam.name);
                          setTeamDesc(selectedTeam.description || '');
                          setTeamLogo(selectedTeam.logo || '');
                          setActiveModal('edit');
                        }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 shrink-0" title="Edit Team">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                      )}
                      <button onClick={() => setSelectedTeam(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10 hover:rotate-90 transition-all duration-300 shrink-0" title="Close Panel">
                        <span className="material-symbols-outlined text-xl">close</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8 flex-1">

                  {/* Invite Members Call-To-Action (Team Leads Only) */}
                  {isCreator(selectedTeam) && (
                    <div className="bg-gradient-to-r from-primary-container/10 to-transparent border border-primary-container/20 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-white mb-1">Grow Your Team</h4>
                        <p className="text-[13px] md:text-sm text-on-surface-variant">Invite contributors to start assigning tasks and tracking accountability.</p>
                      </div>
                      <button
                        onClick={() => setActiveModal('invite')}
                        className="btn-primary-premium flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shrink-0"
                      >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        Invite Members
                      </button>
                    </div>
                  )}

                  {/* Members List */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">groups</span>
                        Team Members ({selectedTeam.members?.length || 0})
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {selectedTeam.members?.map((m) => {
                        const memberUser = m.user || {};
                        const memberId = memberUser._id || m._id;
                        const isCreatorMember = memberId === selectedTeam.creator?._id || memberId === selectedTeam.creator;

                        return (
                          <div key={memberId} className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-low border border-white/5 rounded-2xl p-4 sm:px-5 sm:py-4 hover:border-white/10 transition-all hover:bg-white/[0.02] gap-4 sm:gap-0">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-bright border-2 border-surface flex items-center justify-center text-sm font-bold text-white overflow-hidden shadow-md shrink-0">
                                {memberUser.profilePic ? (
                                  <img src={memberUser.profilePic} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  memberUser.name?.charAt(0)?.toUpperCase() || '?'
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-sm sm:text-base font-bold text-white truncate">{memberUser.name || 'Unknown Member'}</span>
                                  {isCreatorMember && (
                                    <span className="text-[9px] sm:text-[10px] font-black text-primary-container bg-primary-container/10 px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-widest border border-primary-container/20 shrink-0">Team Lead</span>
                                  )}
                                </div>
                                <span className="text-[11px] sm:text-xs text-on-surface-variant truncate block">{memberUser.email || 'No email provided'}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border ${m.role === 'Team Lead' || isCreatorMember
                                ? 'text-primary-container bg-primary-container/10 border-primary-container/20'
                                : 'text-on-surface-variant bg-white/5 border-white/10'
                                }`}>
                                {isCreatorMember ? 'Team Lead' : m.role}
                              </span>
                              {isCreator(selectedTeam) && !isCreatorMember && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleRemoveMember(selectedTeam._id, memberId, memberUser.name); }}
                                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/5 text-red-400/70 hover:text-red-400 hover:bg-red-500/20 border border-transparent hover:border-red-500/20 transition-all"
                                  title="Remove member"
                                >
                                  <span className="material-symbols-outlined text-lg">person_remove</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Panel Footer Actions */}
                <div className="p-4 sm:p-6 border-t border-white/5 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                  <span className="text-[10px] sm:text-xs text-on-surface-variant/50 break-all">Workspace ID: {selectedTeam._id}</span>
                  {isCreator(selectedTeam) ? (
                    <button onClick={() => handleDeleteTeam(selectedTeam._id)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] sm:text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all uppercase tracking-widest">
                      <span className="material-symbols-outlined text-base sm:text-lg">delete_forever</span>
                      Delete Team
                    </button>
                  ) : (
                    <button onClick={() => handleLeaveTeam(selectedTeam._id)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-[11px] sm:text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all uppercase tracking-widest">
                      <span className="material-symbols-outlined text-base sm:text-lg">logout</span>
                      Leave Team
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========= MODALS ========= */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {/* Invite Members Modal (Premium UI) */}
          {activeModal === 'invite' && selectedTeam && (
            <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md overflow-y-auto scrollbar-hide" onClick={() => setActiveModal(null)}>
              <div className="min-h-full flex items-center justify-center p-4 py-12">
                <div className="relative w-full max-w-[500px] bg-surface-container border border-white/10 rounded-3xl shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="p-8 border-b border-white/5 relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary-container/10 blur-[60px] rounded-full pointer-events-none"></div>
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-container/10 rounded-2xl flex items-center justify-center border border-primary-container/20">
                          <span className="material-symbols-outlined text-primary-container text-2xl">person_add</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Invite Members</h3>
                          <p className="text-sm text-on-surface-variant mt-1">Share access to {selectedTeam.name}</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveModal(null)} className="text-on-surface-variant hover:text-white transition-colors bg-white/5 p-2 rounded-xl">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {/* Magic Link */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Share Invite Link</label>
                      <div className="flex items-center gap-2 p-2 bg-background border border-white/10 rounded-2xl">
                        <div className="flex-1 px-4 text-sm text-white truncate font-medium">
                          {clientUrl}/signup?invite={selectedTeam.inviteCode}
                        </div>
                        <button
                          onClick={() => copyToClipboard(`${clientUrl}/signup?invite=${selectedTeam.inviteCode}`, 'link')}
                          className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 text-sm font-bold ${copiedLink
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-white/5 text-white hover:bg-white/10'
                            }`}
                        >
                          <span className="material-symbols-outlined text-lg">{copiedLink ? 'check' : 'content_copy'}</span>
                          {copiedLink ? 'Copied' : 'Copy Link'}
                        </button>
                      </div>
                      <p className="text-xs text-on-surface-variant/60 pl-2">Anyone with this link can join directly.</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/5"></div>
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">OR USE CODE</span>
                      <div className="h-px flex-1 bg-white/5"></div>
                    </div>

                    {/* Invite Code */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Team Invite Code</label>
                        <button onClick={() => handleRegenerateCode(selectedTeam._id)} className="text-xs font-bold text-primary-container hover:text-orange-400 flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-sm">refresh</span> Reset Code
                        </button>
                      </div>
                      <div className="p-6 bg-surface-container-highest border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4">
                        <div className="text-4xl font-mono font-bold text-white tracking-[0.3em] ml-3" style={{ fontFamily: 'Space Grotesk' }}>
                          {selectedTeam.inviteCode}
                        </div>
                        <button
                          onClick={() => copyToClipboard(selectedTeam.inviteCode, 'code')}
                          className={`px-6 py-2.5 rounded-full border transition-all flex items-center gap-2 text-sm font-bold ${copiedCode
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-transparent border-white/20 text-white hover:bg-white/5'
                            }`}
                        >
                          <span className="material-symbols-outlined text-lg">{copiedCode ? 'check' : 'content_copy'}</span>
                          {copiedCode ? 'Code Copied' : 'Copy Code'}
                        </button>
                      </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSendEmail} className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Send Invite via Email</label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                          <input
                            type="email"
                            required
                            placeholder="colleague@company.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full bg-background border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-primary-container outline-none transition-all placeholder:text-on-surface-variant/40"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={sendingEmail}
                          className={`px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all ${sendingEmail ? 'bg-primary-container/50 text-white/50 cursor-not-allowed' : 'btn-primary-premium text-white'}`}
                        >
                          {sendingEmail ? (
                            <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                          ) : (
                            <span className="material-symbols-outlined text-lg">send</span>
                          )}
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Team Modal */}
          {activeModal === 'create' && (
            <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md overflow-y-auto scrollbar-hide" onClick={() => setActiveModal(null)}>
              <div className="min-h-full flex items-center justify-center p-4 py-12">
                <div className="relative w-full max-w-[500px] bg-surface-container border border-white/10 rounded-3xl shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                  <div className="p-8 border-b border-white/5 bg-gradient-to-b from-primary-container/5 to-transparent relative">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-on-surface-variant hover:text-white hover:bg-white/10 transition-all z-20"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center shadow-lg shadow-primary-container/20">
                        <span className="material-symbols-outlined text-white text-3xl">add</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Create Workspace</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Start tracking accountability</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleCreateTeam} className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Workspace Name</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-white/10 rounded-xl p-4 text-base text-white focus:border-primary-container outline-none transition-all placeholder:text-on-surface-variant/30"
                        placeholder="e.g. Product Engineering"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        autoFocus
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Description <span className="text-on-surface-variant/40">(optional)</span></label>
                      <textarea
                        className="w-full bg-background border border-white/10 rounded-xl p-4 text-base text-white focus:border-primary-container outline-none transition-all resize-none placeholder:text-on-surface-variant/30"
                        rows="3"
                        placeholder="What is the focus of this team?"
                        value={teamDesc}
                        onChange={(e) => setTeamDesc(e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Team Logo <span className="text-on-surface-variant/40">(optional)</span></label>
                      <div className="flex items-center gap-4">
                        {teamLogo ? (
                          <div className="relative group">
                            <img src={teamLogo} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" onError={() => setTeamLogo('')} />
                            <button type="button" onClick={() => setTeamLogo('')} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-white/5 border border-white/10 border-dashed rounded-xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-on-surface-variant">image</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <label className="btn-secondary-premium inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white cursor-pointer transition-all">
                            <span className="material-symbols-outlined text-lg">upload</span>
                            Upload Image
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              className="hidden"
                              onChange={handleLogoUpload}
                            />
                          </label>
                          <p className="text-xs text-on-surface-variant mt-2">JPG, PNG or WebP. Max 5MB.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-4 text-base text-on-surface-variant font-bold bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 py-4 text-base text-white font-bold btn-primary-premium rounded-xl flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Team Modal */}
          {activeModal === 'edit' && (
            <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md overflow-y-auto scrollbar-hide" onClick={() => setActiveModal(null)}>
              <div className="min-h-full flex items-center justify-center p-4 py-12">
                <div className="relative w-full max-w-[500px] bg-surface-container border border-white/10 rounded-3xl shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                  <div className="p-8 border-b border-white/5 bg-gradient-to-b from-primary-container/5 to-transparent relative">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-on-surface-variant hover:text-white hover:bg-white/10 transition-all z-20"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-14 h-14 bg-primary-container/10 border border-primary-container/20 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-primary-container text-3xl">edit</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Edit Workspace</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Update team details</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleEditTeam} className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Workspace Name</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-white/10 rounded-xl p-4 text-base text-white focus:border-primary-container outline-none transition-all placeholder:text-on-surface-variant/30"
                        placeholder="e.g. Product Engineering"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        autoFocus
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Description <span className="text-on-surface-variant/40">(optional)</span></label>
                      <textarea
                        className="w-full bg-background border border-white/10 rounded-xl p-4 text-base text-white focus:border-primary-container outline-none transition-all resize-none placeholder:text-on-surface-variant/30"
                        rows="3"
                        placeholder="What is the focus of this team?"
                        value={teamDesc}
                        onChange={(e) => setTeamDesc(e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Team Logo <span className="text-on-surface-variant/40">(optional)</span></label>
                      <div className="flex items-center gap-4">
                        {teamLogo ? (
                          <div className="relative group">
                            <img src={teamLogo} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" onError={() => setTeamLogo('')} />
                            <button type="button" onClick={() => setTeamLogo('')} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-white/5 border border-white/10 border-dashed rounded-xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-on-surface-variant">image</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <label className="btn-secondary-premium inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white cursor-pointer transition-all">
                            <span className="material-symbols-outlined text-lg">upload</span>
                            Upload Image
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              className="hidden"
                              onChange={handleLogoUpload}
                            />
                          </label>
                          <p className="text-xs text-on-surface-variant mt-2">JPG, PNG or WebP. Max 5MB.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-4 text-base text-on-surface-variant font-bold bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 py-4 text-base text-white font-bold btn-primary-premium rounded-xl flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">save</span>
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Join Team Modal */}
          {activeModal === 'join' && (
            <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md overflow-y-auto scrollbar-hide" onClick={() => setActiveModal(null)}>
              <div className="min-h-full flex items-center justify-center p-4 py-12">
                <div className="relative w-full max-w-[500px] bg-surface-container border border-white/10 rounded-3xl shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                  <div className="p-8 border-b border-white/5 bg-gradient-to-b from-orange-500/5 to-transparent relative">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-on-surface-variant hover:text-white hover:bg-white/10 transition-all z-20"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-14 h-14 bg-surface-bright border border-white/10 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-orange-500 text-3xl">vpn_key</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>Join Workspace</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Enter code from your Team Lead</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleJoinTeam} className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center block">Team Invite Code</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-white/10 rounded-xl p-5 text-3xl text-white text-center tracking-[0.3em] uppercase focus:border-primary-container outline-none transition-all placeholder:text-on-surface-variant/20 placeholder:tracking-normal placeholder:text-base placeholder:lowercase"
                        placeholder="e.g. A4F7B2C1"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        maxLength={8}
                        autoFocus
                        required
                        style={{ fontFamily: 'Space Grotesk' }}
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-4 text-base text-on-surface-variant font-bold bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all">
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 py-4 text-base text-white font-bold btn-primary-premium rounded-xl flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">login</span>
                        Join
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>, document.body)}
    </>

  );
}
