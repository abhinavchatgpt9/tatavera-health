'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { LANGUAGES } from '@/lib/constants';

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: 'Patient Name',
    email: 'patient@email.com',
    phone: '',
    country: '',
    emergencyContact: '',
    language: 'en',
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Update your personal details and preferences.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Personal Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  placeholder="Your country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                placeholder="+1 234 567 890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
              <input
                type="text"
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                placeholder="Name and phone number"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Preferences</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-sm">Email Notifications</p>
                <p className="text-gray-500 text-xs">Receive updates about your case</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, notifications: !form.notifications })}
                className={`w-12 h-6 rounded-full transition-colors relative ${form.notifications ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.notifications ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
