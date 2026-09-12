'use client';

import { useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { MOCK_DOCTOR_OPINIONS, MOCK_DOCTOR_PATIENTS } from '@/lib/portal-mock-data';

export default function DoctorOpinionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [patient, setPatient] = useState(MOCK_DOCTOR_PATIENTS[0]?.name ?? '');
  const [summary, setSummary] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const resetForm = () => {
    setPatient(MOCK_DOCTOR_PATIENTS[0]?.name ?? '');
    setSummary('');
    setRecommendation('');
  };

  return (
    <DoctorLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Opinions</h1>
            <p className="text-gray-500 mt-1">Second opinions and clinical summaries for your patients.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {showForm ? 'Close' : '+ Write New Opinion'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">New Medical Opinion</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowForm(false);
                resetForm();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient</label>
                <select
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
                >
                  {MOCK_DOCTOR_PATIENTS.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  placeholder="Clinical summary of findings..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Recommendation</label>
                <textarea
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  rows={3}
                  placeholder="Recommended course of treatment..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {MOCK_DOCTOR_OPINIONS.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🩺</p>
            <p>No medical opinions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_DOCTOR_OPINIONS.map((o) => (
              <div key={o.id} className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <p className="font-semibold text-gray-900">{o.patient}</p>
                  <p className="text-xs text-gray-400">{o.createdAt}</p>
                </div>
                <p className="text-sm text-gray-600">{o.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
