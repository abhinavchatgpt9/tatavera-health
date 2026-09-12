'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

type Message = { id: string; body: string; fromMe: boolean; createdAt: Date };

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', body: 'Hello! I am Priya, your dedicated case manager. I have received your enquiry and will review your medical reports within 24 hours. Please feel free to message me anytime.', fromMe: false, createdAt: new Date(Date.now() - 60 * 60 * 1000) },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), body: input.trim(), fromMe: true, createdAt: new Date() }]);
    setInput('');
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-3xl flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">Chat with your case manager</p>
        </div>

        {/* Case manager header */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 mb-4 flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full flex items-center justify-center text-lg flex-shrink-0">👩‍⚕️</div>
          <div>
            <p className="font-bold text-gray-900 text-sm">Priya Sharma</p>
            <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.fromMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                {msg.body}
                <p className={`text-xs mt-1 ${msg.fromMe ? 'text-blue-200' : 'text-gray-400'}`}>
                  {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
            placeholder="Type a message…"
          />
          <button type="submit" disabled={!input.trim()} className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
