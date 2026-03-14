import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { Trophy, Crown, Medal, Award, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResultsPage() {
  const navigate = useNavigate();
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
      setLeaderboard(l.filter((p: any) => p.evalCount > 0));
    } catch (err) {
      console.error('Failed to fetch results:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rankConfig = [
    { icon: <Crown size={32} className="text-yellow-400" />, bg: 'from-yellow-900/30 to-amber-900/30 border-yellow-600/40', label: '1st Place 🥇', textColor: 'text-yellow-400' },
    { icon: <Medal size={32} className="text-gray-300" />, bg: 'from-gray-800/30 to-slate-800/30 border-gray-500/40', label: '2nd Place 🥈', textColor: 'text-gray-300' },
    { icon: <Award size={32} className="text-amber-600" />, bg: 'from-amber-900/20 to-orange-900/20 border-amber-700/40', label: '3rd Place 🥉', textColor: 'text-amber-600' },
  ];

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading Results...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Hackathon Results</h1>
          <p className="text-gray-400">Final leaderboard and winners</p>
        </div>

        {winners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {winners.map((w, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`bg-gradient-to-br ${rankConfig[i]?.bg} border rounded-2xl p-6 text-center`}>
                <div className="flex justify-center mb-4">{rankConfig[i]?.icon}</div>
                <p className={`font-bold text-sm mb-2 ${rankConfig[i]?.textColor}`}>{rankConfig[i]?.label}</p>
                <h3 className="text-white font-bold text-xl mb-1">{w.teamName}</h3>
                <p className="text-gray-400 text-sm mb-4">{w.projectTitle}</p>
                <div className={`text-3xl font-bold ${rankConfig[i]?.textColor}`}>
                  {w.totalScore}<span className="text-gray-500 text-lg">/50</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-6 text-center mb-8">
            <p className="text-amber-300">Winners have not been declared yet. Check back later!</p>
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold">Full Leaderboard</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50 border-b border-gray-800">
                    {['Rank', 'Team', 'Project', 'Category', 'Score'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {leaderboard.map((p, i) => (
                    <tr key={i} className={`transition-colors ${
                      i === 0 ? 'bg-yellow-900/10' : i === 1 ? 'bg-gray-700/10' : i === 2 ? 'bg-amber-900/10' : 'bg-gray-900/50'
                    } hover:bg-gray-800/50`}>
                      <td className="px-4 py-3">
                        {i === 0 ? <Crown size={16} className="text-yellow-400" /> :
                        i === 1 ? <Medal size={16} className="text-gray-300" /> :
                        i === 2 ? <Award size={16} className="text-amber-600" /> :
                        <span className="text-gray-500 text-sm">{i + 1}</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{p.teamName}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{p.projectTitle}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{p.category}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold text-sm ${
                          p.avgScore >= 40 ? 'text-emerald-400' :
                          p.avgScore >= 25 ? 'text-amber-400' : 'text-red-400'
                        }`}>{p.avgScore}/50</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {leaderboard.length === 0 && winners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results available yet. Evaluations are in progress.</p>
          </div>
        )}
      </div>
    </div>
  );
}
