import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/db';
import { Users, FileText, FolderOpen, ArrowRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import StatCard from '../../components/StatCard';
import { motion } from 'framer-motion';

export default function ParticipantDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const team = user ? db.getTeamByLeader(user.id) : null;
  const project = team ? db.getProjectByTeam(team.id) : null;
  const evaluations = project ? db.getEvaluationsByProject(project.id) : [];
  const avgScore = evaluations.length > 0
    ? (evaluations.reduce((s, e) => s + e.totalScore, 0) / evaluations.length).toFixed(1)
    : null;

  const notifications = user ? db.getNotifications(user.id) : [];
  const unread = notifications.filter(n => !n.read);

  const steps = [
    { label: 'Account Approved', done: true, icon: <CheckCircle size={16} /> },
    { label: 'Create Team', done: !!team, icon: <Users size={16} /> },
    { label: 'Submit Project', done: !!project, icon: <FileText size={16} /> },
    { label: 'Awaiting Evaluation', done: evaluations.length > 0, icon: <Clock size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-400 text-sm mt-1">Your hackathon participant dashboard</p>
      </div>

      {/* Notifications */}
      {unread.length > 0 && (
        <div className="space-y-2">
          {unread.map(n => (
            <div key={n.id} className={`flex items-start gap-3 rounded-xl p-4 border ${
              n.type === 'success' ? 'bg-emerald-900/20 border-emerald-700/40' :
              n.type === 'error' ? 'bg-red-900/20 border-red-700/40' :
              'bg-blue-900/20 border-blue-700/40'
            }`}>
              <AlertCircle size={18} className={n.type === 'success' ? 'text-emerald-400' : n.type === 'error' ? 'text-red-400' : 'text-blue-400'} />
              <p className={`text-sm ${
                n.type === 'success' ? 'text-emerald-300' :
                n.type === 'error' ? 'text-red-300' : 'text-blue-300'
              }`}>{n.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Team Status" value={team ? 'Created' : 'Not Created'}
            icon={<Users size={20} className="text-white" />} color="bg-gradient-to-br from-emerald-600 to-teal-700"
            subtitle={team ? team.teamName : 'Create your team'} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard title="Team Members" value={team ? team.members.length + 1 : 0}
            icon={<Users size={20} className="text-white" />} color="bg-gradient-to-br from-blue-600 to-indigo-700"
            subtitle={`Max 5 members`} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Project" value={project ? 'Submitted' : 'Not Submitted'}
            icon={<FileText size={20} className="text-white" />} color="bg-gradient-to-br from-violet-600 to-purple-700"
            subtitle={project ? project.projectTitle : 'Submit your project'} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatCard title="Score" value={avgScore ? `${avgScore}/50` : 'Pending'}
            icon={<FolderOpen size={20} className="text-white" />} color="bg-gradient-to-br from-amber-600 to-orange-700"
            subtitle={`${evaluations.length} evaluation${evaluations.length !== 1 ? 's' : ''}`} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Steps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Your Progress</h3>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.done ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gray-800 text-gray-500'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${step.done ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                </div>
                {step.done && <CheckCircle size={16} className="text-emerald-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {!team && (
              <button onClick={() => navigate('/participant/team')}
                className="w-full flex items-center justify-between p-4 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-800/50 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-medium">Create Your Team</span>
                </div>
                <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            {team && !project && (
              <button onClick={() => navigate('/participant/submit')}
                className="w-full flex items-center justify-between p-4 bg-violet-900/20 hover:bg-violet-900/30 border border-violet-800/50 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-violet-400" />
                  <span className="text-violet-300 text-sm font-medium">Submit Your Project</span>
                </div>
                <ArrowRight size={16} className="text-violet-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            {team && (
              <button onClick={() => navigate('/participant/team')}
                className="w-full flex items-center justify-between p-4 bg-blue-900/20 hover:bg-blue-900/30 border border-blue-800/50 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">Manage Team</span>
                </div>
                <ArrowRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            {project && (
              <button onClick={() => navigate('/participant/project')}
                className="w-full flex items-center justify-between p-4 bg-amber-900/20 hover:bg-amber-900/30 border border-amber-800/50 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <FolderOpen size={18} className="text-amber-400" />
                  <span className="text-amber-300 text-sm font-medium">View My Project</span>
                </div>
                <ArrowRight size={16} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* Team Info */}
        {team && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Team: {team.teamName}</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Project</p>
                <p className="text-white text-sm font-medium">{team.projectTitle}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Category</p>
                <p className="text-white text-sm font-medium">{team.category}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-xs font-medium">Members ({team.members.length + 1})</p>
              <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                <div className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-xs text-emerald-400 font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-white text-sm">{user?.name}</span>
                <span className="ml-auto text-xs text-emerald-400">Leader</span>
              </div>
              {team.members.map((m, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-violet-900/40 flex items-center justify-center text-xs text-violet-400 font-bold">
                    {m.name.charAt(0)}
                  </div>
                  <span className="text-white text-sm">{m.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evaluations */}
        {evaluations.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Evaluation Scores</h3>
            <div className="space-y-3">
              {evaluations.map(e => (
                <div key={e.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">{e.juryName}</span>
                    <span className={`font-bold ${
                      e.totalScore >= 40 ? 'text-emerald-400' :
                      e.totalScore >= 25 ? 'text-amber-400' : 'text-red-400'
                    }`}>{e.totalScore}/50</span>
                  </div>
                  {e.feedback && <p className="text-gray-400 text-xs">{e.feedback}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
