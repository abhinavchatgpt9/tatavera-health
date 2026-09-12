'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const BLOGS = [
  { id: 'b1', title: 'Why India is the Top Destination for Medical Tourism in 2025', category: 'Destination Guides', status: 'Published', date: '2025-01-15' },
  { id: 'b2', title: 'Complete Guide to Medical Visa for India: Step-by-Step', category: 'Visa & Travel', status: 'Published', date: '2025-01-10' },
  { id: 'b3', title: 'Heart Bypass Surgery Abroad: What to Expect', category: 'Treatment Guides', status: 'Published', date: '2025-01-05' },
  { id: 'b4', title: 'How to Choose the Right Hospital Abroad', category: 'Medical Tourism Tips', status: 'Draft', date: '2026-07-08' },
  { id: 'b5', title: 'Patient Story: My IVF Journey in India', category: 'Patient Stories', status: 'Draft', date: '2026-07-10' },
];

export default function AdminBlogsPage() {
  const [search, setSearch] = useState('');
  const filtered = BLOGS.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Blogs</h1>
        <input
          type="text"
          placeholder="Search blog posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">📰</p>
            <p>No blog posts match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{b.title}</td>
                      <td className="px-5 py-3 text-gray-600">{b.category}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{b.date}</td>
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
