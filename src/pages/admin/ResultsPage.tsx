import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const [winners, setWinners] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [w, l] = await Promise.all([
        apiClient.get('/api/results/winners'),
        apiClient.get('/api/results/leaderboard'),
      ]);
      setWinners(w);
      setLeaderboard(l);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeclareWinners = async () => {
    const top3 = leaderboard.filter(p => p.evalCount > 0).slice(0, 3);
    const newWinners = top3.map((p, i) => ({
      rank: i + 1,
      teamId: p.teamId,
      teamName: p.teamName,
      projectTitle: p.projectTitle,
      totalScore: p.avgScore,
    }));

    try {
      await apiClient.post('/api/results/declare', { winners: newWinners });
      fetchData();
    } catch (err) {
      console.error('Failed to declare winners:', err);
    }
  };

  const rankMedals = [
    { icon: <Crown size={24} className="text-yellow-400" />, color: 'from-yellow-600/20 to-amber-600/20 border-yellow-600/40', label: '1st Place', textColor: 'text-yellow-400' },
    { icon: <Medal size={24} className="text-gray-300" />, color: 'from-gray-600/20 to-slate-600/20 border-gray-500/40', label: '2nd Place', textColor: 'text-gray-300' },
    { icon: <Award size={24} className="text-amber-600" />, color: 'from-amber-800/20 to-orange-800/20 border-amber-700/40', label: '3rd Place', textColor: 'text-amber-600' },
  ];

  if (loading) return <div className="text-center py-20 text-gray-400">Loading Results...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Results & Leaderboard</h1>
          <p className="text-gray-400 text-sm mt-1">Project rankings based on jury evaluations</p>
        </div>
        {leaderboard.some(p => p.evalCount > 0) && (
          <button onClick={handleDeclareWinners}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg">
            <Trophy size={18} /> Declare Winners
          </button>
        )}
      </div>

      {/* Winners Podium */}
      {winners.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-400" /> Winners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {winners.map((w, i) => (
              <motion.div key={w.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${rankMedals[i]?.color || 'from-gray-800/20 to-gray-700/20 border-gray-700/40'} border rounded-xl p-5 text-center`}>
                <div className="flex justify-center mb-3">{rankMedals[i]?.icon}</div>
                <p className={`font-bold text-sm mb-1 ${rankMedals[i]?.textColor || 'text-gray-400'}`}>{rankMedals[i]?.label}</p>
                <h3 className="text-white font-bold text-lg">{w.teamName}</h3>
                <p className="text-gray-400 text-sm mb-3">{w.projectTitle}</p>
                <div className="text-2xl font-bold text-white">{w.totalScore}<span className="text-gray-500 text-sm">/50</span></div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-800">
              {['Rank', 'Team Name', 'Project Title', 'Category', 'Evaluations', 'Avg Score', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {leaderboard.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">No projects submitted yet</td></tr>
            ) : leaderboard.map((p, i) => (
              <tr key={i} className={`transition-colors ${
                i === 0 ? 'bg-yellow-900/10 hover:bg-yellow-900/20' :
                i === 1 ? 'bg-gray-700/10 hover:bg-gray-700/20' :
                i === 2 ? 'bg-amber-900/10 hover:bg-amber-900/20' :
                'bg-gray-900/50 hover:bg-gray-800/50'
              }`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {i === 0 ? <Crown size={16} className="text-yellow-400" /> :
                     i === 1 ? <Medal size={16} className="text-gray-300" /> :
                     i === 2 ? <Award size={16} className="text-amber-600" /> :
                     <span className="text-gray-500 text-sm w-4 text-center">{i + 1}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-white font-medium">{p.teamName}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{p.projectTitle}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.category}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.evalCount}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold text-sm ${
                    p.avgScore >= 40 ? 'text-emerald-400' :
                    p.avgScore >= 25 ? 'text-amber-400' :
                    p.avgScore > 0 ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    {p.avgScore > 0 ? `${p.avgScore}/50` : 'Not evaluated'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {winners.find(w => w.teamId === p.teamId) ? (
                    <span className="text-xs bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 px-2 py-0.5 rounded-full">
                      🏆 Winner
                    </span>
                  ) : p.evalCount === 0 ? (
                    <span className="text-xs text-gray-500">Pending</span>
                  ) : (
                    <span className="text-xs text-gray-400">Evaluated</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
