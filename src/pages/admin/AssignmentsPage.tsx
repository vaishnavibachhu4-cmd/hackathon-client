import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import Badge from '../../components/Badge';

const categoryColors: Record<string, 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'orange'> = {
  'AI/ML': 'purple', 'Web Development': 'blue', 'Mobile App': 'green',
  'IoT': 'yellow', 'Cybersecurity': 'red', 'Blockchain': 'orange',
};

export default function AssignmentsPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedJury, setSelectedJury] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [juryMembers, setJuryMembers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [proj, jury, assign] = await Promise.all([
        apiClient.get('/api/projects'),
        apiClient.get('/api/users/jury'),
        apiClient.get('/api/assignments'),
      ]);
      setProjects(proj);
      setJuryMembers(jury.filter((u: any) => u.approvalStatus === 'approved'));
      setAssignments(assign);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAssign = async () => {
    if (!selectedProject || !selectedJury) {
      setError('Please select both a project and a jury member');
      return;
    }
    try {
      await apiClient.post('/api/assignments', { projectId: selectedProject, juryId: selectedJury });
      const jury = juryMembers.find(j => j._id === selectedJury);
      setSuccess(`Project assigned to ${jury?.name} successfully!`);
      setError('');
      setSelectedProject('');
      setSelectedJury('');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Assignment failed');
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await apiClient.delete(`/api/assignments/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Project Assignments</h1>
        <p className="text-gray-400 text-sm mt-1">Assign projects to jury members for evaluation</p>
      </div>

      {/* Assignment Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Assign Project to Jury</h3>

        {success && (
          <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-3 mb-4">
            <CheckCircle size={16} className="text-emerald-400" />
            <p className="text-emerald-300 text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Select Project</label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500">
              <option value="">-- Select a project --</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.projectTitle} ({p.teamName})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Select Jury Member</label>
            <select value={selectedJury} onChange={e => setSelectedJury(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500">
              <option value="">-- Select a jury member --</option>
              {juryMembers.map(j => (
                <option key={j._id} value={j._id}>{j.name} ({j.expertiseArea || j.email})</option>
              ))}
            </select>
          </div>
        </div>

        {juryMembers.length === 0 && !loading && (
          <p className="text-amber-400 text-sm mb-4">⚠️ No approved jury members available. Please approve jury members first.</p>
        )}
        {projects.length === 0 && !loading && (
          <p className="text-amber-400 text-sm mb-4">⚠️ No projects submitted yet.</p>
        )}

        <button onClick={handleAssign}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-medium transition-all">
          <Plus size={16} /> Assign Project
        </button>
      </div>

      {/* Assignments Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-800">
              {['Project', 'Category', 'Team', 'Jury Member', 'Assigned Date', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : assignments.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No assignments yet</td></tr>
            ) : assignments.map(a => {
              const project = a.projectId;
              const jury = a.juryId;
              return (
                <tr key={a._id} className="bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">{project?.projectTitle || 'Unknown'}</td>
                  <td className="px-4 py-3">
                    {project && <Badge variant={categoryColors[project.category] || 'blue'}>{project.category}</Badge>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{project?.teamName || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{jury?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleRemove(a._id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
