import React, { useState } from 'react';
import { Eye, BarChart3 } from 'lucide-react';
import { db } from '../../lib/db';
import Modal from '../../components/Modal';
import type { Evaluation } from '../../lib/types';

export default function EvaluationsPage() {
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);

  const evaluations = db.getEvaluations();
  const projects = db.getProjects();
  const juryMembers = db.getUsers().filter(u => u.role === 'jury');

  const avgScore = evaluations.length > 0
    ? (evaluations.reduce((s, e) => s + e.totalScore, 0) / evaluations.length).toFixed(1)
    : '0';

  const getProject = (id: string) => projects.find(p => p.id === id);
  const getJury = (id: string) => juryMembers.find(j => j.id === id);

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

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Evaluations', value: evaluations.length, color: 'bg-violet-900/30 border-violet-700/50 text-violet-300' },
          { label: 'Avg Score', value: avgScore + '/50', color: 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300' },
          { label: 'Pending', value: db.getAssignments().length - evaluations.length, color: 'bg-amber-900/30 border-amber-700/50 text-amber-300' },
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
            {evaluations.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-500">No evaluations yet</td></tr>
            ) : evaluations.map(e => {
              const project = getProject(e.projectId);
              return (
                <tr key={e.id} className="bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                  <td className="px-3 py-3 text-sm text-white font-medium">{project?.projectTitle || 'Unknown'}</td>
                  <td className="px-3 py-3 text-sm text-gray-300">{project?.teamName || '—'}</td>
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
                      className="p-1.5 text-violet-400 hover:text-violet-300 hover:bg-violet-900/30 rounded-lg">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedEval} onClose={() => setSelectedEval(null)} title="Evaluation Details" size="lg">
        {selectedEval && (() => {
          const project = getProject(selectedEval.projectId);
          return (
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white text-lg font-bold">{project?.projectTitle}</h3>
                  <p className="text-gray-400 text-sm">{project?.teamName} · Evaluated by {selectedEval.juryName}</p>
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
              <p className="text-xs text-gray-500">Evaluated: {new Date(selectedEval.evaluatedAt).toLocaleString()}</p>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
