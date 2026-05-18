import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, setUser, logout, baseUrl } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    jobRole: user?.jobRole || '',
    profilePic: user?.profilePic || ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    aiSummaries: user?.preferences?.aiSummaries ?? false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        jobRole: user.jobRole || '',
        profilePic: user.profilePic || ''
      });
      if (user.preferences) {
        setPreferences({
          emailNotifications: user.preferences.emailNotifications ?? true,
          aiSummaries: user.preferences.aiSummaries ?? false
        });
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = async (key) => {
    const previousPrefs = { ...preferences }; // snapshot before change
    const updatedPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(updatedPrefs);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.put(`${baseUrl}/auth/profile`, { preferences: updatedPrefs }, config);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (error) {
      toast.error('Failed to update preference');
      setPreferences(previousPrefs); // rollback to captured snapshot, not stale closure
    }
  };

  const handlePurgeData = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px] p-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-500">warning</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Purge All Data?</h4>
            <p className="text-[10px] text-on-surface-variant leading-relaxed">Account and workspace deletion is permanent.</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-[10px] font-bold text-on-surface-variant hover:text-white uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadId = toast.loading('Purging cloud data...');
              try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${baseUrl}/auth/purge`, config);
                toast.success('Workspace Purged. Redirecting...', { id: loadId });
                setTimeout(() => logout(), 2000);
              } catch (error) {
                toast.error(error.response?.data?.message || 'Purge failed', { id: loadId });
              }
            }}
            className="px-5 py-2.5 text-[10px] font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 uppercase tracking-widest"
          >
            Confirm Purge
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: 'purge-confirm' });
  };

  const handleSave = async () => {
    setLoading(true);
    const loadId = toast.loading('Updating profile...');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const response = await axios.put(`${baseUrl}/auth/profile`, formData, config);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!', { id: loadId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile', { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size too large (max 5MB)');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="animate-fade-in space-y-10 pb-20 max-w-7xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Settings</h1>
        <p className="text-on-surface-variant font-body-md">Manage your personal profile and application preferences.</p>
      </div>

      <div className="space-y-10">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">person</span>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk' }}>User Profile</h3>
          </div>

          <div className="bg-surface-container border border-white/5 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container p-1 shadow-lg shadow-primary-container/10 bg-primary-container/20 flex items-center justify-center text-3xl font-bold text-white">
                  {formData.profilePic ? (
                    <img
                      src={formData.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitial()
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-primary-container text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Display Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Job Role</label>
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary-container outline-none transition-all"
                    placeholder="e.g. Product Manager"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Email Address
                    <span className="ml-2 text-[8px] text-on-surface-variant/40 normal-case tracking-normal font-normal">(contact support to change)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full bg-surface-container-low border border-white/5 rounded-xl p-3 text-sm text-on-surface-variant/60 cursor-not-allowed outline-none opacity-60"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-primary-container text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary-container/10 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container">notifications</span>
            <h3 className="text-xl font-bold text-white uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk' }}>Preferences</h3>
          </div>

          <div className="bg-surface-container border border-white/5 rounded-2xl p-6 shadow-xl divide-y divide-white/5">
            {[
              { id: 'emailNotifications', label: 'In-App Notifications', desc: 'Receive alerts when you are assigned tasks or sent reminders.', enabled: preferences.emailNotifications },
              { id: 'aiSummaries', label: 'AI Auto-Summaries', desc: 'Auto-extract key points and tasks after every meeting.', enabled: preferences.aiSummaries }
            ].map(pref => (
              <div key={pref.label} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{pref.label}</h4>
                  <p className="text-xs text-on-surface-variant">{pref.desc}</p>
                </div>
                <button
                  onClick={() => handleToggle(pref.id)}
                  className={`w-12 h-6 rounded-full relative transition-all ${pref.enabled ? 'bg-primary-container shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${pref.enabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">warning</span>
            <h3 className="text-xl font-bold text-red-400 uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk' }}>Danger Zone</h3>
          </div>

          <div className="bg-red-500/[0.02] border border-red-500/10 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="max-w-5xl">
              <h4 className="text-sm font-bold text-white">Purge All Data</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-1">This action is permanent. All meetings, tasks, and historical data will be wiped from the MeetLoop cloud, and your account will be deleted.</p>
            </div>
            <button
              onClick={handlePurgeData}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-red-500/20 shadow-lg shadow-red-500/5"
            >
              Purge Data
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
