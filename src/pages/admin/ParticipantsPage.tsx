import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';

interface User {
  _id: string;
  name: string;
  email: string;
  college?: string;
  phone?: string;
  role: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function ParticipantsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = useCallback(async () => {
    try {
      const data = await apiClient.get('/api/users/participants');
      setParticipants(data);
    } catch (err) {
      console.error('Failed to fetch participants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchParticipants(); }, [fetchParticipants]);

  const handleApprove = async (id: string) => {
    try {
      await apiClient.patch(`/api/users/${id}/status`, { approvalStatus: 'approved' });
      fetchParticipants();
      setSelectedUser(null);
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient.patch(`/api/users/${id}/status`, { approvalStatus: 'rejected' });
      fetchParticipants();
      setSelectedUser(null);
    } catch (err) { console.error(err); }
  };

  const filtered = participants
    .filter(u => filter === 'all' || u.approvalStatus === filter)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const pending = participants.filter(u => u.approvalStatus === 'pending').length;
  const approved = participants.filter(u => u.approvalStatus === 'approved').length;
  const rejected = participants.filter(u => u.approvalStatus === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Participants</h1>
        <p className="text-gray-400 text-sm mt-1">Manage participant registrations and approvals</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pending, color: 'bg-amber-900/30 border-amber-700/50 text-amber-300' },
          { label: 'Approved', value: approved, color: 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300' },
          { label: 'Rejected', value: rejected, color: 'bg-red-900/30 border-red-700/50 text-red-300' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-gray-500 text-sm outline-none focus:border-violet-500" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-violet-500">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Participant</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">College</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No participants found</td></tr>
            ) : filtered.map(p => (
              <tr key={p._id} className="bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{p.name}</p>
                      <p className="text-gray-400 text-xs">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{p.college || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{p.phone || '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.approvalStatus}>
                    {p.approvalStatus.charAt(0).toUpperCase() + p.approvalStatus.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedUser(p)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors" title="View">
                      <Eye size={15} />
                    </button>
                    {p.approvalStatus !== 'approved' && (
                      <button onClick={() => handleApprove(p._id)} className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 rounded-lg transition-colors" title="Approve">
                        <CheckCircle size={15} />
                      </button>
                    )}
                    {p.approvalStatus !== 'rejected' && (
                      <button onClick={() => handleReject(p._id)} className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors" title="Reject">
                        <XCircle size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Participant Details">
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-2xl font-bold">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">{selectedUser.name}</h3>
                <p className="text-gray-400">{selectedUser.email}</p>
                <Badge variant={selectedUser.approvalStatus}>{selectedUser.approvalStatus}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'College', value: selectedUser.college },
                { label: 'Phone', value: selectedUser.phone },
                { label: 'Role', value: selectedUser.role },
                { label: 'Registered', value: new Date(selectedUser.createdAt).toLocaleDateString() },
              ].map(f => (
                <div key={f.label} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">{f.label}</p>
                  <p className="text-white text-sm">{f.value || '—'}</p>
                </div>
              ))}
            </div>
            {selectedUser.approvalStatus === 'pending' && (
              <div className="flex gap-3">
                <button onClick={() => handleApprove(selectedUser._id)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium">
                  Approve
                </button>
                <button onClick={() => handleReject(selectedUser._id)}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium">
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
