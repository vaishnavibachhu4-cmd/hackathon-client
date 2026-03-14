import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { db, generateId } from '../../lib/db';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import type { User } from '../../lib/types';

export default function JuryPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const juryMembers = db.getUsers().filter(u => u.role === 'jury')
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleApprove = (id: string) => {
    db.updateUser(id, { approvalStatus: 'approved' });
    db.addNotification({ id: generateId(), userId: id, message: 'Your jury registration has been approved!', type: 'success', read: false, createdAt: new Date().toISOString() });
    refresh();
  };

  const handleReject = (id: string) => {
    db.updateUser(id, { approvalStatus: 'rejected' });
    refresh();
  };

  const allJury = db.getUsers().filter(u => u.role === 'jury');
  const assignments = db.getAssignments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Jury Members</h1>
        <p className="text-gray-400 text-sm mt-1">Manage jury member registrations</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: allJury.filter(u => u.approvalStatus === 'pending').length, color: 'bg-amber-900/30 border-amber-700/50 text-amber-300' },
          { label: 'Approved', value: allJury.filter(u => u.approvalStatus === 'approved').length, color: 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300' },
          { label: 'Total Assignments', value: assignments.length, color: 'bg-blue-900/30 border-blue-700/50 text-blue-300' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search jury members..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-800">
              {['Jury Member', 'Organization', 'Expertise', 'Assignments', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {juryMembers.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No jury members found</td></tr>
            ) : juryMembers.map(j => {
              const assignmentCount = assignments.filter(a => a.juryId === j.id).length;
              return (
                <tr key={j.id} className="bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {j.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{j.name}</p>
                        <p className="text-gray-400 text-xs">{j.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{j.organization || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-300">{j.expertiseArea || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-white text-sm font-medium">{assignmentCount}</span>
                    <span className="text-gray-500 text-xs ml-1">project{assignmentCount !== 1 ? 's' : ''}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={j.approvalStatus as 'pending' | 'approved' | 'rejected'}>
                      {j.approvalStatus.charAt(0).toUpperCase() + j.approvalStatus.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedUser(j)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                        <Eye size={15} />
                      </button>
                      {j.approvalStatus !== 'approved' && (
                        <button onClick={() => handleApprove(j.id)} className="p-1.5 text-emerald-400 hover:bg-emerald-900/30 rounded-lg">
                          <CheckCircle size={15} />
                        </button>
                      )}
                      {j.approvalStatus !== 'rejected' && (
                        <button onClick={() => handleReject(j.id)} className="p-1.5 text-red-400 hover:bg-red-900/30 rounded-lg">
                          <XCircle size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Jury Member Details">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white text-2xl font-bold">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">{selectedUser.name}</h3>
                <p className="text-gray-400">{selectedUser.email}</p>
                <Badge variant={selectedUser.approvalStatus as 'pending' | 'approved' | 'rejected'}>
                  {selectedUser.approvalStatus}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Organization', value: selectedUser.organization },
                { label: 'Expertise Area', value: selectedUser.expertiseArea },
                { label: 'Registered', value: new Date(selectedUser.createdAt).toLocaleDateString() },
                { label: 'Assignments', value: assignments.filter(a => a.juryId === selectedUser.id).length + ' projects' },
              ].map(f => (
                <div key={f.label} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">{f.label}</p>
                  <p className="text-white text-sm">{f.value || '—'}</p>
                </div>
              ))}
            </div>
            {selectedUser.approvalStatus === 'pending' && (
              <div className="flex gap-3">
                <button onClick={() => { handleApprove(selectedUser.id); setSelectedUser(null); }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium">Approve</button>
                <button onClick={() => { handleReject(selectedUser.id); setSelectedUser(null); }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium">Reject</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
