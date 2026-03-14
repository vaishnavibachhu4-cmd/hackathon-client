import React, { useState } from 'react';
import { Search, Eye, Users } from 'lucide-react';
import { db } from '../../lib/db';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import type { Team } from '../../lib/types';

const categoryColors: Record<string, 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'orange'> = {
  'AI/ML': 'purple',
  'Web Development': 'blue',
  'Mobile App': 'green',
  'IoT': 'yellow',
  'Cybersecurity': 'red',
  'Blockchain': 'orange',
};

export default function TeamsPage() {
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const teams = db.getTeams().filter(t =>
    t.teamName.toLowerCase().includes(search.toLowerCase()) ||
    t.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
    t.leaderName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Teams</h1>
        <p className="text-gray-400 text-sm mt-1">All registered teams and their details</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search teams..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500" />
        </div>
        <span className="text-gray-400 text-sm">{teams.length} team{teams.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No teams found</div>
        ) : teams.map(team => (
          <div key={team.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">{team.teamName}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{team.projectTitle}</p>
              </div>
              <Badge variant={categoryColors[team.category] || 'blue'}>{team.category}</Badge>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center">
                <Users size={13} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-300 text-xs font-medium">{team.leaderName}</p>
                <p className="text-gray-500 text-xs">Team Leader</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">{team.members.length + 1} member{team.members.length !== 0 ? 's' : ''}</span>
              <button onClick={() => setSelectedTeam(team)}
                className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-900/20 hover:bg-violet-900/40 px-3 py-1.5 rounded-lg transition-all">
                <Eye size={13} /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!selectedTeam} onClose={() => setSelectedTeam(null)} title="Team Details" size="lg">
        {selectedTeam && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white text-xl font-bold">{selectedTeam.teamName}</h3>
                <p className="text-gray-400">{selectedTeam.projectTitle}</p>
              </div>
              <Badge variant={categoryColors[selectedTeam.category] || 'blue'}>{selectedTeam.category}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Team Leader</p>
                <p className="text-white text-sm font-medium">{selectedTeam.leaderName}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Created</p>
                <p className="text-white text-sm">{new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Team Members ({selectedTeam.members.length})</h4>
              {selectedTeam.members.length === 0 ? (
                <p className="text-gray-500 text-sm">No additional members</p>
              ) : (
                <div className="space-y-2">
                  {selectedTeam.members.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-lg p-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold">
                        {m.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{m.name}</p>
                        <p className="text-gray-400 text-xs">{m.email}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">{m.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
