import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../lib/apiClient';
import { Eye, Star, CheckCircle } from 'lucide-react';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import EvaluationForm from './EvaluationForm';

const categoryColors: Record<string, 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'orange'> = {
  'AI/ML': 'purple', 'Web Development': 'blue', 'Mobile App': 'green',
  'IoT': 'yellow', 'Cybersecurity': 'red', 'Blockchain': 'orange',
};

export default function AssignedProjectsPage() {
  const { user } = useAuthStore();
  const [viewProject, setViewProject] = useState<any | null>(null);
  const [evaluateProject, setEvaluateProject] = useState<any | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [assigns, evals] = await Promise.all([
        apiClient.get('/api/assignments/my'),
        apiClient.get('/api/evaluations/my'),
      ]);
      setAssignments(assigns);
      setEvaluations(evals);
    } catch (err) {
      console.error('Failed to fetch assigned projects:', err);
      setAssignments([]);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [fetchData, user?.id]);

  const getEvaluation = (projectId: string) => {
    return evaluations.find(e => e.projectId?._id === projectId || e.projectId === projectId);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assigned Projects</h1>
        <p className="text-gray-400 text-sm mt-1">Projects assigned to you for evaluation</p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={28} className="text-gray-600" />
          </div>
          <h3 className="text-white font-semibold mb-2">No Projects Assigned</h3>
          <p className="text-gray-400 text-sm">The admin will assign projects to you soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {assignments.map(a => {
            const project = a.projectId;
            if (!project) return null;
            const evaluated = getEvaluation(project._id);
            return (
              <div key={a._id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{project.projectTitle}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{project.teamName} · {project.leaderName}</p>
                  </div>
                  <Badge variant={categoryColors[project.category] || 'blue'}>{project.category}</Badge>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>

                <div className="flex items-center gap-2">
                  {evaluated ? (
                    <div className="flex items-center gap-2 flex-1">
                      <CheckCircle size={16} className="text-emerald-400" />
                      <span className="text-emerald-300 text-sm">Evaluated: {evaluated.totalScore}/50</span>
                    </div>
                  ) : (
                    <span className="text-amber-400 text-xs bg-amber-900/20 px-2 py-1 rounded-full flex-1">Pending evaluation</span>
                  )}
                  <button onClick={() => setViewProject(project)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                  <button onClick={() => setEvaluateProject(project)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      evaluated
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white'
                    }`}>
                    <Star size={13} />
                    {evaluated ? 'Re-evaluate' : 'Evaluate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Project Modal */}
      <Modal isOpen={!!viewProject} onClose={() => setViewProject(null)} title="Project Details" size="lg">
        {viewProject && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white text-xl font-bold">{viewProject.projectTitle}</h3>
                <p className="text-gray-400">{viewProject.teamName}</p>
              </div>
              <Badge variant={categoryColors[viewProject.category] || 'blue'}>{viewProject.category}</Badge>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Description</p>
              <p className="text-gray-300 text-sm leading-relaxed bg-gray-800 rounded-lg p-4">{viewProject.description}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Tech Stack</p>
              <p className="text-gray-300 text-sm bg-gray-800 rounded-lg p-3">{viewProject.techStack}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {viewProject.githubLink && (
                <a href={viewProject.githubLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                  GitHub Repository
                </a>
              )}
              {viewProject.demoVideo && (
                <a href={viewProject.demoVideo} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                  Project Video Link
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Evaluation Modal */}
      <Modal isOpen={!!evaluateProject} onClose={() => { setEvaluateProject(null); fetchData(); }} title="Evaluate Project" size="lg">
        {evaluateProject && user && (
          <EvaluationForm
            project={evaluateProject}
            juryId={user.id}
            juryName={user.name}
            onComplete={() => { setEvaluateProject(null); fetchData(); }}
          />
        )}
      </Modal>
    </div>
  );
}
