import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/db';
import { Github, Play, Download, Edit, FileText, BarChart3 } from 'lucide-react';
import Badge from '../../components/Badge';

const categoryColors: Record<string, 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'orange'> = {
  'AI/ML': 'purple', 'Web Development': 'blue', 'Mobile App': 'green',
  'IoT': 'yellow', 'Cybersecurity': 'red', 'Blockchain': 'orange',
};

export default function MyProjectPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const team = user ? db.getTeamByLeader(user.id) : null;
  const project = team ? db.getProjectByTeam(team.id) : null;
  const evaluations = project ? db.getEvaluationsByProject(project.id) : [];

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText size={48} className="text-gray-600 mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">No Project Submitted</h2>
        <p className="text-gray-400 text-sm mb-6">You haven't submitted a project yet.</p>
        <button onClick={() => navigate('/participant/submit')}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium">
          Submit Project
        </button>
      </div>
    );
  }

  const avgScore = evaluations.length > 0
    ? (evaluations.reduce((s, e) => s + e.totalScore, 0) / evaluations.length).toFixed(1)
    : null;

  const handleDownload = () => {
    if (project.projectFileData) {
      const link = document.createElement('a');
      link.href = project.projectFileData;
      link.download = project.projectFileName || 'project-file';
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Project</h1>
          <p className="text-gray-400 text-sm mt-1">Your submitted project details</p>
        </div>
        <button onClick={() => navigate('/participant/submit')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm border border-gray-700">
          <Edit size={16} /> Edit
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white text-xl font-bold">{project.projectTitle}</h2>
            <p className="text-gray-400">{project.teamName}</p>
          </div>
          <Badge variant={categoryColors[project.category] || 'blue'}>{project.category}</Badge>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Description</p>
            <p className="text-gray-300 text-sm leading-relaxed bg-gray-800 rounded-lg p-4">{project.description}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Technology Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.split(',').map(t => (
                <span key={t} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs border border-gray-700">{t.trim()}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">
                <Github size={16} /> GitHub
              </a>
            )}
            {project.demoVideo && (
              <a href={project.demoVideo} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm">
                <Play size={16} /> Project Video Link
              </a>
            )}
            {project.projectFileData && (
              <button onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 rounded-lg text-sm">
                <Download size={16} /> Download Video: {project.projectFileName}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">Submitted: {new Date(project.submissionDate).toLocaleString()}</p>
        </div>
      </div>

      {/* Evaluations */}
      {evaluations.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <BarChart3 size={18} className="text-violet-400" /> Evaluations
            </h3>
            {avgScore && (
              <span className={`text-2xl font-bold ${
                parseFloat(avgScore) >= 40 ? 'text-emerald-400' :
                parseFloat(avgScore) >= 25 ? 'text-amber-400' : 'text-red-400'
              }`}>{avgScore}<span className="text-gray-500 text-sm">/50</span></span>
            )}
          </div>
          <div className="space-y-4">
            {evaluations.map(e => (
              <div key={e.id} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium text-sm">{e.juryName}</span>
                  <span className={`font-bold ${
                    e.totalScore >= 40 ? 'text-emerald-400' :
                    e.totalScore >= 25 ? 'text-amber-400' : 'text-red-400'
                  }`}>{e.totalScore}/50</span>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {[
                    { label: 'Innovation', val: e.innovation },
                    { label: 'Technical', val: e.technical },
                    { label: 'UI/UX', val: e.uiux },
                    { label: 'Presentation', val: e.presentation },
                    { label: 'Impact', val: e.impact },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="text-white font-bold text-sm">{s.val}</div>
                      <div className="text-gray-500 text-xs">{s.label}</div>
                    </div>
                  ))}
                </div>
                {e.feedback && <p className="text-gray-400 text-xs border-t border-gray-700 pt-3">{e.feedback}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
