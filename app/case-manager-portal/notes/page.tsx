'use client';

import { useState } from 'react';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_CM_NOTES } from '@/lib/portal-mock-data';

export default function NotesPage() {
  const [draft, setDraft] = useState('');

  const grouped = MOCK_CM_NOTES.reduce<Record<string, typeof MOCK_CM_NOTES>>((acc, note) => {
    (acc[note.lead] ||= []).push(note);
    return acc;
  }, {});

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-500 mt-1">Internal notes on your assigned cases.</p>
        </div>

        {/* Add note */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-3">Add Note</h2>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a note about a case..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none"
          />
          <div className="flex justify-end mt-3">
            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Add Note
            </button>
          </div>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">📝</p>
            <p>No notes yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([leadName, notes]) => (
              <div key={leadName}>
                <h3 className="font-bold text-gray-900 mb-3">{leadName}</h3>
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                      <p className="text-sm text-gray-700">{note.body}</p>
                      <p className="text-xs text-gray-400 mt-3">{note.author} · {note.createdAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CaseManagerLayout>
  );
}
