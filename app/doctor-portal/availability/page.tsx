'use client';

import { useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { MOCK_DOCTOR_AVAILABILITY } from '@/lib/portal-mock-data';

export default function DoctorAvailabilityPage() {
  const [availability, setAvailability] = useState(
    MOCK_DOCTOR_AVAILABILITY.map((a) => ({ ...a }))
  );
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [draftSlots, setDraftSlots] = useState('');

  const startEdit = (day: string, slots: string) => {
    setEditingDay(day);
    setDraftSlots(slots);
  };

  const cancelEdit = () => {
    setEditingDay(null);
    setDraftSlots('');
  };

  const saveEdit = (day: string) => {
    setAvailability((prev) => prev.map((a) => (a.day === day ? { ...a, slots: draftSlots } : a)));
    setEditingDay(null);
    setDraftSlots('');
  };

  return (
    <DoctorLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="text-gray-500 mt-1">Click a day to edit your available time slots.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-3 font-medium w-40">Day</th>
                <th className="px-5 py-3 font-medium">Available Slots</th>
                <th className="px-5 py-3 font-medium w-32"></th>
              </tr>
            </thead>
            <tbody>
              {availability.map((a) => {
                const isEditing = editingDay === a.day;
                return (
                  <tr key={a.day} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-gray-900">{a.day}</td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={draftSlots}
                          onChange={(e) => setDraftSlots(e.target.value)}
                          placeholder="e.g. 09:00 - 13:00, 15:00 - 18:00"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400"
                          autoFocus
                        />
                      ) : a.slots === 'Unavailable' ? (
                        <span className="text-gray-400">Unavailable</span>
                      ) : (
                        <span className="text-gray-600">{a.slots}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => saveEdit(a.day)}
                            className="text-blue-600 text-xs font-semibold hover:underline"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-400 text-xs font-semibold hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(a.day, a.slots)}
                          className="text-blue-600 text-xs font-semibold hover:underline"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DoctorLayout>
  );
}
