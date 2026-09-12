import type { Metadata } from 'next';
import DashboardLayout from '@/components/DashboardLayout';

export const metadata: Metadata = { title: 'My Appointments | Tatavera Health' };

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">Upcoming and past consultations.</p>
        </div>

        {/* Upcoming */}
        <h2 className="font-bold text-gray-800 mb-3">Upcoming</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>No upcoming appointments.</p>
          <p className="text-sm mt-1">Your case manager will schedule consultations and notify you here.</p>
        </div>

        {/* Past */}
        <h2 className="font-bold text-gray-800 mb-3">Past Appointments</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center text-gray-400">
          <p className="text-sm">No past appointments yet.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
