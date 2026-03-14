import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../lib/apiClient';
import { BarChart3 } from 'lucide-react';

export default function MyEvaluationsPage() {
  const { user } = useAuthStore();
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const evals = await apiClient.get('/api/evaluations/my');
      setEvaluations(evals || []);
    } catch (err) {
      console.error('Failed to fetch evaluations:', err);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [fetchData, user?.id]);

  const avgScore = evaluations.length > 0
    ? (evaluations.reduce((s, e) => s + (e.totalScore || 0), 0) / evaluations.length).toFixed(1)
    : null;

  const ScoreBar = ({ label, value }: { label: string; value: number }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{value}/10</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Evaluations</h1>
          <p className="text-gray-400 text-sm mt-1">All projects you have evaluated</p>
        </div>
        {avgScore && (
          <div className="text-right">
            <p className="text-gray-400 text-xs">Average Score</p>
            <p className="text-2xl font-bold text-amber-400">{avgScore}/50</p>
          </div>
        )}
      </div>

      {evaluations.length === 0 ? (
        <div className="text-center py-20">
          <BarChart3 size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No Evaluations Yet</h3>
          <p className="text-gray-400 text-sm">Start evaluating your assigned projects.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {evaluations.map((e) => {
            const project = e.projectId;
            return (
              <div key={e._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{project?.projectTitle || 'Unknown Project'}</h3>
                    <p className="text-gray-400 text-sm">{project?.teamName || 'Team —'} · {project?.category || 'General'}</p>
                  </div>
                  <div className={`text-2xl font-bold ${
                    e.totalScore >= 40 ? 'text-emerald-400' :
                    e.totalScore >= 25 ? 'text-amber-400' : 'text-red-400'
                  }`}>{e.totalScore}<span className="text-gray-500 text-sm">/50</span></div>
                </div>
                <div className="space-y-2 mb-4">
                  <ScoreBar label="Innovation" value={e.innovation} />
                  <ScoreBar label="Technical Implementation" value={e.technical} />
                  <ScoreBar label="UI/UX" value={e.uiux} />
                  <ScoreBar label="Presentation" value={e.presentation} />
                  <ScoreBar label="Impact / Usefulness" value={e.impact} />
                </div>
                {e.feedback && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-gray-400 text-xs font-medium mb-1">Feedback</p>
                    <p className="text-gray-300 text-sm">{e.feedback}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-3">Evaluated: {new Date(e.evaluatedAt || e.createdAt).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
