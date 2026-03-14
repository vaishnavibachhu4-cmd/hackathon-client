import React, { useState, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import Modal from '../../components/Modal';

export default function EvaluationsPage() {
  const [selectedEval, setSelectedEval] = useState<any | null>(null);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, avg: '0', pending: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await apiClient.get('/api/evaluations');
      setEvaluations(data);
      
      const total = data.length;
      const avg = total > 0 
        ? (data.reduce((s: number, e: any) => s + e.totalScore, 0) / total).toFixed(1)
        : '0';
      
      // We'd ideally get assignments count too, but let's just use what we have
      // or fetch assignments to calculate pending.
      const assignments = await apiClient.get('/api/assignments');
      const pending = assignments.length - total;
      
      setStats({ total, avg, pending: pending > 0 ? pending : 0 });
    } catch (err) {
      console.error('Failed to fetch evaluations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ScoreBar = ({ label, value }: { label: string; value: number }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{value}/10</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Evaluations</h1>
        <p className="text-gray-400 text-sm mt-1">All jury evaluations and scores</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Evaluations', value: stats.total, color: 'bg-violet-900/30 border-violet-700/50 text-violet-300' },
          { label: 'Avg Score', value: stats.avg + '/50', color: 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300' },
          { label: 'Pending', value: stats.pending, color: 'bg-amber-900/30 border-amber-700/50 text-amber-300' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-800">
              {['Project', 'Team', 'Jury Member', 'Innovation', 'Technical', 'UI/UX', 'Presentation', 'Impact', 'Total', 'Actions'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {loading ? (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : evaluations.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-500">No evaluations yet</td></tr>
            ) : evaluations.map(e => (
              <tr key={e._id} className="bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                <td className="px-3 py-3 text-sm text-white font-medium">{e.projectId?.projectTitle || 'Deleted Project'}</td>
                <td className="px-3 py-3 text-sm text-gray-300">{e.projectId?.teamName || '—'}</td>
                <td className="px-3 py-3 text-sm text-gray-300">{e.juryName}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-300">{e.innovation}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-300">{e.technical}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-300">{e.uiux}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-300">{e.presentation}</td>
                <td className="px-3 py-3 text-sm text-center text-gray-300">{e.impact}</td>
                <td className="px-3 py-3">
                  <span className={`font-bold text-sm ${
                    e.totalScore >= 40 ? 'text-emerald-400' :
                    e.totalScore >= 25 ? 'text-amber-400' : 'text-red-400'
                  }`}>{e.totalScore}/50</span>
                </td>
                <td className="px-3 py-3">
                  <button onClick={() => setSelectedEval(e)}
                    className="p-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-900/30 rounded-lg transition-colors">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedEval} onClose={() => setSelectedEval(null)} title="Evaluation Details" size="lg">
        {selectedEval && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white text-lg font-bold">{selectedEval.projectId?.projectTitle}</h3>
                <p className="text-gray-400 text-sm">{selectedEval.projectId?.teamName} · Evaluated by {selectedEval.juryName}</p>
              </div>
              <div className={`text-2xl font-bold ${
                selectedEval.totalScore >= 40 ? 'text-emerald-400' :
                selectedEval.totalScore >= 25 ? 'text-amber-400' : 'text-red-400'
              }`}>{selectedEval.totalScore}/50</div>
            </div>
            <div className="space-y-3">
              <ScoreBar label="Innovation" value={selectedEval.innovation} />
              <ScoreBar label="Technical Implementation" value={selectedEval.technical} />
              <ScoreBar label="UI/UX" value={selectedEval.uiux} />
              <ScoreBar label="Presentation" value={selectedEval.presentation} />
              <ScoreBar label="Impact / Usefulness" value={selectedEval.impact} />
            </div>
            {selectedEval.feedback && (
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Feedback</p>
                <p className="text-gray-300 text-sm leading-relaxed bg-gray-800 rounded-lg p-4">{selectedEval.feedback}</p>
              </div>
            )}
            <p className="text-xs text-gray-500">Evaluated: {new Date(selectedEval.evaluatedAt || selectedEval.createdAt).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
