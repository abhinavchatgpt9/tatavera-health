'use client';

import { useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { MOCK_DOCTOR } from '@/lib/portal-mock-data';

export default function DoctorProfilePage() {
  const [name, setName] = useState(MOCK_DOCTOR.name);
  const [specialty, setSpecialty] = useState(MOCK_DOCTOR.specialty);
  const [designation, setDesignation] = useState(MOCK_DOCTOR.designation);
  const [hospital, setHospital] = useState(MOCK_DOCTOR.hospital);
  const [languages, setLanguages] = useState('English, Hindi');
  const [about, setAbout] = useState(
    `${MOCK_DOCTOR.name} is a ${MOCK_DOCTOR.designation} at ${MOCK_DOCTOR.hospital} with extensive experience in ${MOCK_DOCTOR.specialty.toLowerCase()}.`
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DoctorLayout>
      <div className="p-6 lg:p-10 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">Manage how you appear to patients and hospitals.</p>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital</label>
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Languages Spoken</label>
            <input
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="e.g. English, Hindi, Arabic"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Save Changes
            </button>
            {saved && <span className="text-sm font-medium text-green-600">✓ Profile updated</span>}
          </div>
        </form>
      </div>
    </DoctorLayout>
  );
}
