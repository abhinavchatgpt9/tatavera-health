'use client';

import { useState } from 'react';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_CM_TASKS } from '@/lib/portal-mock-data';
import { PRIORITY_COLORS } from '@/lib/lead-stage';

export default function TasksPage() {
  const [filter, setFilter] = useState('ALL');
  const tasks = MOCK_CM_TASKS.filter((t) => filter === 'ALL' || t.status === filter);

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="text-gray-500 mt-1">Track follow-ups and action items across your leads.</p>
          </div>
          <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">+ New Task</button>
        </div>

        <div className="flex gap-2 mb-6">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'DONE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">✅</p>
            <p>No tasks in this view.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4">
                <input type="checkbox" checked={task.status === 'DONE'} readOnly className="w-5 h-5 rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-400">{task.lead} · Due {task.dueAt}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </CaseManagerLayout>
  );
}
