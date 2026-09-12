'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { MOCK_AUDIT_LOGS } from '@/lib/portal-mock-data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export default function AdminAuditLogsPage() {
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('ALL');

  const users = useMemo(
    () => Array.from(new Set(MOCK_AUDIT_LOGS.map((l) => l.user))),
    []
  );

  const filtered = MOCK_AUDIT_LOGS.filter((l) => {
    const matchesSearch = l.action.toLowerCase().includes(search.toLowerCase());
    const matchesUser = userFilter === 'ALL' || l.user === userFilter;
    return matchesSearch && matchesUser;
  });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500 mt-1">{filtered.length} of {MOCK_AUDIT_LOGS.length} events</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="ALL">All Users</option>
            {users.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🧾</p>
            <p>No audit events match your filters.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">User</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                    <th className="px-5 py-3 font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log) => (
                    <tr key={log.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{log.user}</td>
                      <td className="px-5 py-3 text-gray-600">{log.action}</td>
                      <td className="px-5 py-3 text-gray-500">{formatDate(log.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
