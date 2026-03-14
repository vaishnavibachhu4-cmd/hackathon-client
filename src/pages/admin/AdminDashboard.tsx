import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FolderOpen, Gavel, Trophy, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    participants: [] as any[],
    juryMembers: [] as any[],
    projects: [] as any[],
    assignments: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [participants, jury, projects, assignments] = await Promise.all([
        apiClient.get('/api/users/participants'),
        apiClient.get('/api/users/jury'),
        apiClient.get('/api/projects'),
        apiClient.get('/api/assignments'),
      ]);
      setStats({ participants, juryMembers: jury, projects, assignments });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const { participants, juryMembers, projects, assignments } = stats;
  const pendingParticipants = participants.filter((u: any) => u.approvalStatus === 'pending');
  const pendingJury = juryMembers.filter((u: any) => u.approvalStatus === 'pending');
  const approvedParticipants = participants.filter((u: any) => u.approvalStatus === 'approved');

  const recentProjects = [...projects].reverse().slice(0, 5);
  const recentUsers = [...participants, ...juryMembers].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const categoryStats = projects.reduce((acc: any, p: any) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of the hackathon management system</p>
      </div>

      {/* Alerts */}
      {(pendingParticipants.length > 0 || pendingJury.length > 0) && (
        <div className="space-y-2">
          {pendingParticipants.length > 0 && (
            <div className="flex items-center gap-3 bg-amber-900/20 border border-amber-700/40 rounded-xl p-4">
              <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
              <p className="text-amber-300 text-sm">
                <span className="font-semibold">{pendingParticipants.length} participant(s)</span> awaiting approval.
              </p>
              <button onClick={() => navigate('/admin/participants')}
                className="ml-auto text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg">
                Review
              </button>
            </div>
          )}
          {pendingJury.length > 0 && (
            <div className="flex items-center gap-3 bg-blue-900/20 border border-blue-700/40 rounded-xl p-4">
              <AlertCircle size={18} className="text-blue-400 flex-shrink-0" />
              <p className="text-blue-300 text-sm">
                <span className="font-semibold">{pendingJury.length} jury member(s)</span> awaiting approval.
              </p>
              <button onClick={() => navigate('/admin/jury')}
                className="ml-auto text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg">
                Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Total Participants" value={participants.length} icon={<Users size={20} className="text-white" />}
            color="bg-gradient-to-br from-emerald-600 to-teal-700" subtitle={`${approvedParticipants.length} approved`} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard title="Projects" value={projects.length} icon={<ClipboardList size={20} className="text-white" />}
            color="bg-gradient-to-br from-blue-600 to-indigo-700" subtitle="submitted" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Jury Members" value={juryMembers.length} icon={<Gavel size={20} className="text-white" />}
            color="bg-gradient-to-br from-amber-600 to-orange-700" subtitle={`${assignments.length} assignments`} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatCard title="Assignments" value={assignments.length} icon={<Trophy size={20} className="text-white" />}
            color="bg-gradient-to-br from-violet-600 to-purple-700" subtitle="total assigned" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Projects</h3>
            <button onClick={() => navigate('/admin/projects')} className="text-xs text-violet-400 hover:text-violet-300">View all</button>
          </div>
          {loading ? (
            <p className="text-gray-500 text-sm text-center py-6">Loading...</p>
          ) : recentProjects.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No projects submitted yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p: any) => (
                <div key={p._id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-9 h-9 bg-violet-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderOpen size={16} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.projectTitle}</p>
                    <p className="text-gray-400 text-xs">{p.teamName} · {p.category}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(p.submissionDate || p.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Category Distribution</h3>
            <TrendingUp size={16} className="text-gray-500" />
          </div>
          {Object.keys(categoryStats).length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No projects submitted yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([cat, count]: any) => {
                const pct = Math.round((count / projects.length) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{cat}</span>
                      <span className="text-gray-400">{count} project{count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Registrations */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Registrations</h3>
            <button onClick={() => navigate('/admin/participants')} className="text-xs text-violet-400 hover:text-violet-300">View all</button>
          </div>
          {loading ? (
            <p className="text-gray-500 text-sm text-center py-6">Loading...</p>
          ) : recentUsers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No registrations yet</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u: any) => (
                <div key={u._id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{u.name}</p>
                    <p className="text-gray-400 text-xs capitalize">{u.role} · {u.college || u.organization || ''}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    u.approvalStatus === 'approved' ? 'bg-emerald-900/40 text-emerald-300' :
                    u.approvalStatus === 'rejected' ? 'bg-red-900/40 text-red-300' :
                    'bg-amber-900/40 text-amber-300'
                  }`}>{u.approvalStatus}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Review Participants', path: '/admin/participants', color: 'bg-emerald-900/30 hover:bg-emerald-900/50 border-emerald-800/50 text-emerald-300', icon: <Users size={18} /> },
              { label: 'Manage Jury', path: '/admin/jury', color: 'bg-amber-900/30 hover:bg-amber-900/50 border-amber-800/50 text-amber-300', icon: <Gavel size={18} /> },
              { label: 'Assign Projects', path: '/admin/assignments', color: 'bg-blue-900/30 hover:bg-blue-900/50 border-blue-800/50 text-blue-300', icon: <ClipboardList size={18} /> },
              { label: 'View Results', path: '/admin/results', color: 'bg-violet-900/30 hover:bg-violet-900/50 border-violet-800/50 text-violet-300', icon: <Trophy size={18} /> },
            ].map(action => (
              <button key={action.path} onClick={() => navigate(action.path)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${action.color}`}>
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
