'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const CMS_BLOCKS = [
  { id: 'c1', title: 'Homepage Hero', slug: 'home-hero', updatedAt: '2026-07-05', status: 'Published' },
  { id: 'c2', title: 'Why Choose Us Section', slug: 'why-choose-us', updatedAt: '2026-06-28', status: 'Published' },
  { id: 'c3', title: 'FAQ Page', slug: 'faq', updatedAt: '2026-07-01', status: 'Published' },
  { id: 'c4', title: 'About Us Page', slug: 'about-us', updatedAt: '2026-07-11', status: 'Draft' },
  { id: 'c5', title: 'New Landing Page — Cardiac Care', slug: 'cardiac-care-lp', updatedAt: '2026-07-12', status: 'Draft' },
];

export default function AdminCmsPage() {
  const [search, setSearch] = useState('');
  const filtered = CMS_BLOCKS.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">CMS</h1>
        <input
          type="text"
          placeholder="Search content blocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🗂️</p>
            <p>No content blocks match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Slug</th>
                    <th className="px-5 py-3 font-medium">Last Updated</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{c.title}</td>
                      <td className="px-5 py-3 text-gray-500">/{c.slug}</td>
                      <td className="px-5 py-3 text-gray-500">{c.updatedAt}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {c.status}
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
