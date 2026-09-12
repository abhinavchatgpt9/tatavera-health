'use client';

import { useState } from 'react';
import HospitalLayout from '@/components/HospitalLayout';
import { MOCK_HOSPITAL } from '@/lib/portal-mock-data';

export default function HospitalSettingsPage() {
  const [name, setName] = useState(MOCK_HOSPITAL.name);
  const [city, setCity] = useState(MOCK_HOSPITAL.city);
  const [country, setCountry] = useState(MOCK_HOSPITAL.country);
  const [accreditations, setAccreditations] = useState(MOCK_HOSPITAL.accreditations.join(', '));
  const [specialties, setSpecialties] = useState('Cardiology, Cardiac Surgery, Electrophysiology, Critical Care');
  const [description, setDescription] = useState(
    'A JCI and NABH accredited multi-specialty hospital renowned for advanced cardiac care, offering world-class treatment for international patients.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <HospitalLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your hospital profile.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Accreditations</label>
              <input
                type="text"
                value={accreditations}
                onChange={(e) => setAccreditations(e.target.value)}
                placeholder="e.g. JCI, NABH"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {accreditations.split(',').map((a) => a.trim()).filter(Boolean).map((a) => (
                  <span key={a} className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialties</label>
              <input
                type="text"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                placeholder="Comma-separated specialties"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {specialties.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Save Changes
              </button>
              {saved && (
                <span className="text-sm font-medium text-green-600">✓ Changes saved successfully</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </HospitalLayout>
  );
}
