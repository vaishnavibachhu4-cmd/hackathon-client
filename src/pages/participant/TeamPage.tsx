import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../lib/apiClient';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';

const categories = ['AI/ML', 'Web Development', 'Mobile App', 'IoT', 'Cybersecurity', 'Blockchain'];

export default function TeamPage() {
  const { user } = useAuthStore();
  const [team, setTeam] = useState<any>(null);
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState('AI/ML');
  const [members, setMembers] = useState<any[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const t = await apiClient.get('/api/teams/my');
      setTeam(t);
      if (t) {
        setTeamName(t.teamName || '');
        setProjectTitle(t.projectTitle || '');
        setCategory(t.category || 'AI/ML');
        setMembers(t.members || []);
      } else {
        setTeamName('');
        setProjectTitle('');
        setCategory('AI/ML');
        setMembers([]);
      }
    } catch (err) { 
      console.error(err);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    if (user) fetchTeam(); 
  }, [fetchTeam, user?.id]);

  const addMember = () => {
    if (members.length >= 4) { setError('Maximum 4 additional members (5 total including you)'); return; }
    setMembers(prev => [...prev, { name: '', email: '', role: '' }]);
  };

  const updateMember = (i: number, field: string, value: string) => {
    setMembers(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  };

  const removeMember = (i: number) => setMembers(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!teamName.trim() || !projectTitle.trim()) { setError('Team name and project title are required'); return; }
    const invalidMember = members.find(m => !m.name.trim() || !m.email.trim() || !m.role.trim());
    if (invalidMember) { setError('Please fill in all member fields'); return; }
    setLoading(true);
    try {
      await apiClient.post('/api/teams', { teamName, projectTitle, category, members });
      setSuccess(team ? 'Team updated successfully!' : 'Team created successfully!');
      fetchTeam();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save team');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{team ? 'Manage Team' : 'Create Team'}</h1>
        <p className="text-gray-400 text-sm mt-1">Set up your hackathon team details</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-emerald-900/20 border border-emerald-700/40 rounded-xl p-4">
          <CheckCircle size={18} className="text-emerald-400" />
          <p className="text-emerald-300 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Team Information</h3>
          {error && <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-red-300 text-sm mb-4">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Team Name *</label>
              <input value={teamName} onChange={e => setTeamName(e.target.value)} required
                placeholder="e.g. Tech Innovators"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Title *</label>
              <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} required
                placeholder="e.g. AI-Powered Health Monitor"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Category *</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-500">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Team Members</h3>
            <span className="text-gray-400 text-xs">{members.length + 1}/5 members</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-emerald-900/20 border border-emerald-800/40 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400 font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
            <span className="text-xs bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded-full">Team Leader</span>
          </div>
          <div className="space-y-3">
            {members.map((m, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm font-medium">Member {i + 1}</span>
                  <button type="button" onClick={() => removeMember(i)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input value={m.name} onChange={e => updateMember(i, 'name', e.target.value)}
                    placeholder="Full Name" required
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm outline-none focus:border-emerald-500" />
                  <input value={m.email} onChange={e => updateMember(i, 'email', e.target.value)}
                    placeholder="Email" type="email" required
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm outline-none focus:border-emerald-500" />
                  <input value={m.role} onChange={e => updateMember(i, 'role', e.target.value)}
                    placeholder="Role (e.g. Developer)" required
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm outline-none focus:border-emerald-500" />
                </div>
              </div>
            ))}
          </div>
          {members.length < 4 && (
            <button type="button" onClick={addMember}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 bg-emerald-900/20 hover:bg-emerald-900/30 px-4 py-2 rounded-lg transition-all">
              <Plus size={16} /> Add Member
            </button>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all disabled:opacity-60">
          <Save size={18} />
          {loading ? 'Saving...' : team ? 'Update Team' : 'Create Team'}
        </button>
      </form>
    </div>
  );
}
