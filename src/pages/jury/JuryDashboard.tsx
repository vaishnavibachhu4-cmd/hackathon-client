import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/db';
import { FolderOpen, ClipboardList, BarChart3, ArrowRight, AlertCircle } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { motion } from 'framer-motion';

export default function JuryDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const assignments = user ? db.getAssignmentsByJury(user.id) : [];
  const evaluations = assignments.map(a => db.getEvaluationByJuryProject(user!.id, a.projectId)).filter(Boolean);
  const pending = assignments.length - evaluations.length;

  const notifications = user ? db.getNotifications(user.id) : [];
  const unread = notifications.filter(n => !n.read);

  const recentAssignments = assignments.slice(-3).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-400 text-sm mt-1">Your jury evaluation dashboard</p>
      </div>

      {unread.length > 0 && (
        <div className="space-y-2">
          {unread.map(n => (
            <div key={n.id} className="flex items-start gap-3 bg-blue-900/20 border border-blue-700/40 rounded-xl p-4">
              <AlertCircle size={18} className="text-blue-400 flex-shrink-0" />
              <p className="text-blue-300 text-sm">{n.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Assigned Projects" value={assignments.length}
            icon={<FolderOpen size={20} className="text-white" />} color="bg-gradient-to-br from-amber-600 to-orange-700" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard title="Evaluated" value={evaluations.length}
            icon={<ClipboardList size={20} className="text-white" />} color="bg-gradient-to-br from-emerald-600 to-teal-700" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Pending" value={pending}
            icon={<BarChart3 size={20} className="text-white" />} color="bg-gradient-to-br from-violet-600 to-purple-700" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Assignments</h3>
            <button onClick={() => navigate('/jury/projects')} className="text-xs text-amber-400 hover:text-amber-300">View all</button>
          </div>
          {recentAssignments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No projects assigned yet</p>
          ) : (
            <div className="space-y-3">
              {recentAssignments.map(a => {
                const project = db.getProjectById(a.projectId);
                const evaluated = db.getEvaluationByJuryProject(user!.id, a.projectId);
                return (
                  <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-9 h-9 bg-amber-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen size={16} className="text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{project?.projectTitle}</p>
                      <p className="text-gray-400 text-xs">{project?.teamName}</p>
                    </div>
                    {evaluated
                      ? <span className="text-xs text-emerald-400">{evaluated.totalScore}/50</span>
                      : <span className="text-xs text-amber-400">Pending</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/jury/projects')}
              className="w-full flex items-center justify-between p-4 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/50 rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <FolderOpen size={18} className="text-amber-400" />
                <span className="text-amber-300 text-sm font-medium">View Assigned Projects</span>
              </div>
              <ArrowRight size={16} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/jury/evaluations')}
              className="w-full flex items-center justify-between p-4 bg-violet-900/20 hover:bg-violet-900/30 border border-violet-800/50 rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-violet-400" />
                <span className="text-violet-300 text-sm font-medium">My Evaluations</span>
              </div>
              <ArrowRight size={16} className="text-violet-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Profile */}
          <div className="mt-4 bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">My Profile</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Organization</span>
                <span className="text-white text-xs">{user?.organization || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Expertise</span>
                <span className="text-white text-xs">{user?.expertiseArea || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Email</span>
                <span className="text-white text-xs">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
