'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const NOTIFICATIONS = [
  { id: 'n1', title: 'New treatment guide published', audience: 'All Patients', date: '2026-07-10', status: 'Sent' },
  { id: 'n2', title: 'Platform maintenance scheduled', audience: 'All Users', date: '2026-07-11', status: 'Sent' },
  { id: 'n3', title: 'New hospital onboarding: Mount Elizabeth', audience: 'Doctors', date: '2026-07-09', status: 'Sent' },
  { id: 'n4', title: 'Reminder: complete your profile', audience: 'Hospitals', date: '2026-07-12', status: 'Scheduled' },
  { id: 'n5', title: 'Monthly newsletter — July edition', audience: 'All Patients', date: '2026-07-15', status: 'Scheduled' },
];

export default function AdminNotificationsPage() {
  const [search, setSearch] = useState('');
  const filtered = NOTIFICATIONS.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🔔</p>
            <p>No notifications match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Audience</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((n) => (
                    <tr key={n.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{n.title}</td>
                      <td className="px-5 py-3 text-gray-600">{n.audience}</td>
                      <td className="px-5 py-3 text-gray-500">{n.date}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${n.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {n.status}
                        </span>
                      </td>
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
