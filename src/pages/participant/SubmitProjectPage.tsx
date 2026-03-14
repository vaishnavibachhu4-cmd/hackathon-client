import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/apiClient';
import { Github, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function SubmitProjectPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [team, setTeam] = useState<any>(null);
  const [existingProject, setExistingProject] = useState<any>(null);
  const [formData, setFormData] = useState({ description: '', techStack: '', githubLink: '', demoVideo: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setFetching(true);
      const t = await apiClient.get('/api/teams/my');
      setTeam(t);
      if (t) {
        const p = await apiClient.get('/api/projects/my');
        if (p) {
          setExistingProject(p);
          setFormData({ description: p.description || '', techStack: p.techStack || '', githubLink: p.githubLink || '', demoVideo: p.demoVideo || '' });
        } else {
          setExistingProject(null);
          setFormData({ description: '', techStack: '', githubLink: '', demoVideo: '' });
        }
      }
    } catch (err) { 
      console.error(err);
      setTeam(null);
      setExistingProject(null);
    } finally { 
      setFetching(false); 
    }
  }, []);

  useEffect(() => { 
    if (user) fetchData(); 
  }, [fetchData, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.description.trim()) { setError('Description is required'); return; }
    if (!formData.techStack.trim()) { setError('Technology stack is required'); return; }
    if (!formData.githubLink.trim()) { setError('GitHub Repository link is required'); return; }
    setLoading(true);
    try {
      await apiClient.post('/api/projects', formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-amber-900/40 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-amber-400" />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">No Team Found</h2>
        <p className="text-gray-400 text-sm mb-6">You need to create a team before submitting a project.</p>
        <button onClick={() => navigate('/participant/team')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium">
          Create Team
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-emerald-900/40 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={36} className="text-emerald-400" />
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">Project {existingProject ? 'Updated' : 'Submitted'}!</h2>
        <p className="text-gray-400 text-sm mb-6">Your project has been {existingProject ? 'updated' : 'submitted'} successfully.</p>
        <button onClick={() => navigate('/participant/project')}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium">
          View My Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{existingProject ? 'Update Project' : 'Submit Project'}</h1>
        <p className="text-gray-400 text-sm mt-1">Submit your hackathon project details</p>
      </div>

      <div className="bg-gray-900 border border-emerald-800/40 rounded-xl p-4">
        <p className="text-emerald-300 text-sm">
          <span className="font-semibold">Team:</span> {team.teamName} ·
          <span className="font-semibold ml-2">Project:</span> {team.projectTitle} ·
          <span className="font-semibold ml-2">Category:</span> {team.category}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-red-300 text-sm">{error}</div>}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h3 className="text-white font-semibold">Project Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Description *</label>
            <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              rows={4} required placeholder="Describe your project, what problem it solves, and how it works..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Technology Stack *</label>
            <input value={formData.techStack} onChange={e => setFormData(p => ({ ...p, techStack: e.target.value }))}
              required placeholder="e.g. React, Node.js, MongoDB, TensorFlow"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">GitHub Repository *</label>
              <div className="relative">
                <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={formData.githubLink} onChange={e => setFormData(p => ({ ...p, githubLink: e.target.value }))}
                  required placeholder="https://github.com/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Video Link <span className="text-gray-500">(optional)</span></label>
              <div className="relative">
                <Play size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={formData.demoVideo} onChange={e => setFormData(p => ({ ...p, demoVideo: e.target.value }))}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-emerald-500" />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all disabled:opacity-60">
          {loading ? 'Submitting...' : existingProject ? 'Update Project' : 'Submit Project'}
        </button>
      </form>
    </div>
  );
}
