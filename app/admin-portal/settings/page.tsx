'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { SITE_NAME, CONTACT_EMAIL, LANGUAGES } from '@/lib/constants';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'INR'];

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState(SITE_NAME);
  const [contactEmail, setContactEmail] = useState(CONTACT_EMAIL);
  const [currency, setCurrency] = useState('USD');
  const [languages, setLanguages] = useState<string[]>(LANGUAGES.map((l) => l.code));
  const [features, setFeatures] = useState({
    whatsapp: true,
    blog: true,
    testimonials: true,
    maintenance: false,
  });
  const [saved, setSaved] = useState(false);

  const toggleLanguage = (code: string) => {
    setLanguages((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Platform-wide configuration.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 space-y-5">
          <h2 className="font-bold text-gray-900">General</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Supported Languages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {LANGUAGES.map((lang) => (
              <label key={lang.code} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={languages.includes(lang.code)}
                  onChange={() => toggleLanguage(lang.code)}
                  className="w-4 h-4 rounded"
                />
                <span>{lang.flag} {lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 space-y-3">
          <h2 className="font-bold text-gray-900 mb-1">Feature Toggles</h2>
          {[
            { key: 'whatsapp', label: 'Enable WhatsApp Widget' },
            { key: 'blog', label: 'Enable Blog' },
            { key: 'testimonials', label: 'Enable Testimonials' },
            { key: 'maintenance', label: 'Maintenance Mode' },
          ].map((f) => (
            <label key={f.key} className="flex items-center gap-3 py-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={features[f.key as keyof typeof features]}
                onChange={() =>
                  setFeatures((prev) => ({ ...prev, [f.key]: !prev[f.key as keyof typeof features] }))
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-gray-700">{f.label}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Save Settings
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">✓ Settings saved</span>}
        </div>
      </div>
    </AdminLayout>
  );
}
