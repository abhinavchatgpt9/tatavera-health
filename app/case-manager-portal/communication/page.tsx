'use client';

import { useState } from 'react';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_CM_LEADS } from '@/lib/portal-mock-data';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const MOCK_THREAD = [
  { from: 'them', text: 'Hi, I wanted to check on the status of my hospital quotation.' },
  { from: 'me', text: 'Hello! Thanks for reaching out — the hospital is finalizing it and should send it over by tomorrow.' },
  { from: 'them', text: 'Great, thank you. Also, do I need to submit any additional medical reports?' },
  { from: 'me', text: 'No additional reports needed for now, we have everything the doctor requires.' },
  { from: 'them', text: 'Perfect, appreciate the quick update.' },
  { from: 'me', text: 'Anytime! I will message you as soon as the quotation is ready.' },
];

export default function CommunicationPage() {
  const [selectedLeadId, setSelectedLeadId] = useState(MOCK_CM_LEADS[0].id);
  const [message, setMessage] = useState('');
  const selectedLead = MOCK_CM_LEADS.find((l) => l.id === selectedLeadId) ?? MOCK_CM_LEADS[0];

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Communication</h1>
          <p className="text-gray-500 mt-1">Message your assigned patients directly.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 border-r border-gray-100 overflow-y-auto">
            {MOCK_CM_LEADS.map((lead) => {
              const active = lead.id === selectedLeadId;
              return (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    active ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {initials(lead.name)}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${active ? 'text-blue-700' : 'text-gray-900'}`}>{lead.name}</p>
                    <p className="text-xs text-gray-400 truncate">{lead.country}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Thread */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {initials(selectedLead.name)}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{selectedLead.name}</p>
                <p className="text-xs text-gray-400">{selectedLead.country} · {selectedLead.treatment}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {MOCK_THREAD.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      msg.from === 'me' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
              <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </CaseManagerLayout>
  );
}
