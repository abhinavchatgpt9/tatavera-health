import type { Metadata } from 'next';
import Link from 'next/link';
import HospitalLayout from '@/components/HospitalLayout';
import {
  MOCK_HOSPITAL,
  MOCK_HOSPITAL_DOCTORS,
  MOCK_HOSPITAL_DEPARTMENTS,
  MOCK_HOSPITAL_LEADS,
  MOCK_HOSPITAL_QUOTATIONS,
} from '@/lib/portal-mock-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Hospital Dashboard | Tatavera Health' };

export default function HospitalDashboard() {
  const doctorCount = MOCK_HOSPITAL_DOCTORS.length;
  const departmentCount = MOCK_HOSPITAL_DEPARTMENTS.length;
  const activeLeads = MOCK_HOSPITAL_LEADS.length;
  const pendingQuotations = MOCK_HOSPITAL_QUOTATIONS.filter(
    (q) => q.status === 'DRAFT' || q.status === 'SENT'
  ).length;

  return (
    <HospitalLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back 👋</h1>
          <p className="text-gray-500 mt-1">Here&apos;s an overview of your hospital&apos;s activity.</p>
        </div>

        {/* Hospital Info Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{MOCK_HOSPITAL.name}</h2>
              <p className="text-gray-500 mt-1">{MOCK_HOSPITAL.city}, {MOCK_HOSPITAL.country}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {MOCK_HOSPITAL.accreditations.map((a) => (
                  <span key={a} className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <p className="text-2xl font-bold text-gray-900">⭐ {MOCK_HOSPITAL.rating}</p>
                <p className="text-xs text-gray-500 mt-1">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_HOSPITAL.bedsCount}</p>
                <p className="text-xs text-gray-500 mt-1">Beds</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Doctors', value: doctorCount, emoji: '🩺' },
            { label: 'Departments', value: departmentCount, emoji: '🏢' },
            { label: 'Active Leads', value: activeLeads, emoji: '📋' },
            { label: 'Pending Quotations', value: pendingQuotations, emoji: '💰' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Leads */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Patient Leads</h2>
            <Link href="/hospital-portal/leads" className="text-blue-600 text-sm font-semibold hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Patient</th>
                  <th className="pb-2 font-medium">Treatment</th>
                  <th className="pb-2 font-medium">Stage</th>
                  <th className="pb-2 font-medium text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_HOSPITAL_LEADS.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.country}</p>
                    </td>
                    <td className="py-3 text-gray-600">{lead.treatment}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${LEAD_STAGE_COLORS[lead.stage]}`}>
                        {LEAD_STAGE_LABELS[lead.stage]}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-gray-900">${lead.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HospitalLayout>
  );
}
