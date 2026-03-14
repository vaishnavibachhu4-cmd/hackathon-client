import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';
import { CheckCircle } from 'lucide-react';

interface Props {
  project: any;
  juryId: string;
  juryName: string;
  onComplete: () => void;
}

const criteria = [
  { key: 'innovation', label: 'Innovation', desc: 'How novel and creative is the idea?' },
  { key: 'technical', label: 'Technical Implementation', desc: 'Quality of code, architecture, and technical execution' },
  { key: 'uiux', label: 'UI/UX Design', desc: 'User interface design and user experience' },
  { key: 'presentation', label: 'Presentation', desc: 'How well is the project presented and documented?' },
  { key: 'impact', label: 'Impact / Usefulness', desc: 'Real-world impact and practical usefulness' },
] as const;

export default function EvaluationForm({ project, juryId, juryName, onComplete }: Props) {
  const [scores, setScores] = useState({
    innovation: 5,
    technical: 5,
    uiux: 5,
    presentation: 5,
    impact: 5,
  });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      if (!project) return;
      setFetching(true);
      setDone(false);
      try {
        const evals = await apiClient.get('/api/evaluations/my');
        const existing = evals.find((e: any) => e.projectId?._id === project?._id || e.projectId === project?._id);
        if (existing) {
          setScores({
            innovation: existing.innovation ?? 5,
            technical: existing.technical ?? 5,
            uiux: existing.uiux ?? 5,
            presentation: existing.presentation ?? 5,
            impact: existing.impact ?? 5,
          });
          setFeedback(existing.feedback || '');
        } else {
          setScores({ innovation: 5, technical: 5, uiux: 5, presentation: 5, impact: 5 });
          setFeedback('');
        }
      } catch (err) {
        console.error('Failed to fetch existing evaluation:', err);
        setScores({ innovation: 5, technical: 5, uiux: 5, presentation: 5, impact: 5 });
        setFeedback('');
      } finally {
        setFetching(false);
      }
    };
    fetchExisting();
  }, [project]);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScore = (key: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/api/evaluations', {
        projectId: project._id || project.id,
        ...scores,
        feedback,
      });
      setDone(true);
      setTimeout(onComplete, 1500);
    } catch (err) {
      console.error('Failed to submit evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-8 text-gray-400">Loading...</div>;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <h3 className="text-white font-bold text-lg mb-1">Evaluation Submitted!</h3>
        <p className="text-gray-400 text-sm">Score: {total}/50</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-gray-800 rounded-xl p-4">
        <h4 className="text-white font-semibold">{project.projectTitle}</h4>
        <p className="text-gray-400 text-sm">{project.teamName} · {project.category}</p>
      </div>

      {/* Score Summary */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-700/40 rounded-xl p-4">
        <span className="text-amber-300 font-medium">Total Score</span>
        <span className="text-3xl font-bold text-white">{total}<span className="text-gray-400 text-lg">/50</span></span>
      </div>

      {/* Criteria */}
      <div className="space-y-4">
        {criteria.map(c => (
          <div key={c.key} className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-white text-sm font-medium">{c.label}</p>
                <p className="text-gray-500 text-xs">{c.desc}</p>
              </div>
              <span className="text-2xl font-bold text-white w-12 text-right">{scores[c.key]}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-gray-500 text-xs">0</span>
              <input
                type="range"
                min={0}
                max={10}
                value={scores[c.key]}
                onChange={e => handleScore(c.key, parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-amber-500"
                style={{
                  background: `linear-gradient(to right, #d97706 ${scores[c.key] * 10}%, #374151 ${scores[c.key] * 10}%)`
                }}
              />
              <span className="text-gray-500 text-xs">10</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Feedback (Optional)</label>
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
          rows={3} placeholder="Provide detailed feedback about the project..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500 resize-none" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-semibold transition-all disabled:opacity-60">
        {loading ? 'Submitting...' : 'Submit Evaluation'}
      </button>
    </form>
  );
}
