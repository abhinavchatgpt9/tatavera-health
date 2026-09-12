import type { Metadata } from 'next';
import DoctorLayout from '@/components/DoctorLayout';
import {
  MOCK_DOCTOR,
  MOCK_DOCTOR_PATIENTS,
  MOCK_DOCTOR_APPOINTMENTS,
  MOCK_DOCTOR_OPINIONS,
} from '@/lib/portal-mock-data';

export const metadata: Metadata = { title: 'Doctor Dashboard | Tatavera Health' };

export default function DoctorDashboard() {
  const today = '2026-07-13';
  const todaysAppointments = MOCK_DOCTOR_APPOINTMENTS.filter((a) => a.scheduledAt.startsWith(today));

  const firstName = MOCK_DOCTOR.name.replace(/^Dr\.\s*/, '').split(' ')[0];

  return (
    <DoctorLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {firstName} 👋</h1>
          <p className="text-gray-500 mt-1">Here&apos;s your schedule and patient overview for today.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Appointments", value: todaysAppointments.length, emoji: '📅' },
            { label: 'Total Patients', value: MOCK_DOCTOR_PATIENTS.length, emoji: '🧑‍🤝‍🧑' },
            { label: 'Pending Opinions', value: MOCK_DOCTOR_OPINIONS.length, emoji: '🩺' },
            { label: 'Avg. Rating', value: MOCK_DOCTOR.rating.toFixed(1), emoji: '⭐' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Doctor info card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">My Profile</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                🩺
              </div>
              <div>
                <p className="font-semibold text-gray-900">{MOCK_DOCTOR.name}</p>
                <p className="text-sm text-gray-500">{MOCK_DOCTOR.designation}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Specialty</span>
                <span className="font-medium text-gray-900">{MOCK_DOCTOR.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Hospital</span>
                <span className="font-medium text-gray-900">{MOCK_DOCTOR.hospital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rating</span>
                <span className="font-medium text-gray-900">⭐ {MOCK_DOCTOR.rating} ({MOCK_DOCTOR.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Today's appointments */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Today&apos;s Appointments</h2>
            {todaysAppointments.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">No appointments scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {todaysAppointments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{a.patient}</p>
                      <p className="text-xs text-gray-400">{a.type === 'VIDEO' ? '💻 Video' : '🏥 In-Person'} · {new Date(a.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 bg-green-100 text-green-700">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All patients preview */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">My Patients</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Patient</th>
                  <th className="pb-2 font-medium">Treatment</th>
                  <th className="pb-2 font-medium">Stage</th>
                  <th className="pb-2 font-medium text-right">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DOCTOR_PATIENTS.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.country}</p>
                    </td>
                    <td className="py-3 text-gray-600">{p.treatment}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {p.stage.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-500">{p.lastVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
