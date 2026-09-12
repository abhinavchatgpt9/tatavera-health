import type { Metadata } from 'next';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export const metadata: Metadata = { title: 'My Dashboard | Tatavera Health' };

const JOURNEY_STAGES = [
  { label: 'Enquiry Submitted', key: 'ENQUIRY_SUBMITTED' },
  { label: 'Case Assigned', key: 'CASE_ASSIGNED' },
  { label: 'Consultation Scheduled', key: 'CONSULTATION_SCHEDULED' },
  { label: 'Travel Planned', key: 'TRAVEL_PLANNED' },
  { label: 'Treatment', key: 'TREATMENT' },
  { label: 'Recovery', key: 'RECOVERY' },
  { label: 'Follow-Up', key: 'FOLLOW_UP' },
];

export default function DashboardPage() {
  const currentStage = 'CASE_ASSIGNED';
  const currentIndex = JOURNEY_STAGES.findIndex((s) => s.key === currentStage);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-5xl">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
          <p className="text-gray-500 mt-1">Here&apos;s the status of your medical journey.</p>
        </div>

        {/* Case Status */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Your Case Status</h2>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Active</span>
          </div>
          {/* Progress bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {JOURNEY_STAGES.map((stage, i) => (
                <div key={stage.key} className="flex flex-col items-center flex-1">
                  <div className={`w-4 h-4 rounded-full border-2 border-white ${i <= currentIndex ? 'bg-white' : 'bg-white/30'} relative z-10`} />
                </div>
              ))}
            </div>
            {/* Line */}
            <div className="absolute top-2 left-0 right-0 h-0.5 bg-white/30 -translate-y-0.5 z-0" />
            <div
              className="absolute top-2 left-0 h-0.5 bg-white -translate-y-0.5 z-0 transition-all"
              style={{ width: `${(currentIndex / (JOURNEY_STAGES.length - 1)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {JOURNEY_STAGES.map((stage, i) => (
              <div key={stage.key} className="flex-1 text-center">
                <p className={`text-xs ${i === currentIndex ? 'text-white font-bold' : 'text-white/60'} hidden lg:block`}>
                  {stage.label}
                </p>
              </div>
            ))}
          </div>
          <p className="lg:hidden mt-3 text-sm font-semibold">
            Current: {JOURNEY_STAGES[currentIndex]?.label}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Upload Report', href: '/dashboard/reports', emoji: '📤' },
            { label: 'Message Manager', href: '/dashboard/messages', emoji: '💬' },
            { label: 'View Appointments', href: '/dashboard/appointments', emoji: '📅' },
            { label: 'Edit Profile', href: '/dashboard/profile', emoji: '✏️' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-sm hover:border-blue-200 transition-all"
            >
              <div className="text-2xl mb-2">{action.emoji}</div>
              <p className="text-sm font-medium text-gray-800">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Case Manager Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Your Case Manager</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              👩‍⚕️
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Priya Sharma</p>
              <p className="text-gray-500 text-sm">Senior Case Manager · Speaks English, Hindi</p>
            </div>
            <div className="flex gap-2">
              <a
                href="https://wa.me/919877263279"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                💬 WhatsApp
              </a>
              <Link href="/dashboard/messages" className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                ✉️ Message
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Appointment */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Upcoming Appointments</h2>
            <Link href="/dashboard/appointments" className="text-blue-600 text-sm font-semibold hover:underline">View all</Link>
          </div>
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p>No appointments scheduled yet.</p>
            <p className="text-sm mt-1">Your case manager will schedule your first consultation.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
