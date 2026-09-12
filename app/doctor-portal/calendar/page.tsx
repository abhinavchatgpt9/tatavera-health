import type { Metadata } from 'next';
import DoctorLayout from '@/components/DoctorLayout';
import { MOCK_DOCTOR_APPOINTMENTS } from '@/lib/portal-mock-data';

export const metadata: Metadata = { title: 'Calendar | Tatavera Health' };

const APPT_TYPE_LABELS: Record<string, string> = {
  VIDEO: '💻 Video',
  IN_PERSON: '🏥 In-Person',
};

const APPT_STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  SCHEDULED: 'bg-amber-100 text-amber-700',
};

export default function DoctorCalendarPage() {
  const grouped = MOCK_DOCTOR_APPOINTMENTS.reduce<Record<string, typeof MOCK_DOCTOR_APPOINTMENTS>>((acc, a) => {
    const dateKey = a.scheduledAt.slice(0, 10);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(a);
    return acc;
  }, {});

  const days = Object.keys(grouped).sort();

  return (
    <DoctorLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">Your upcoming appointments, grouped by day.</p>
        </div>

        {days.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🗓️</p>
            <p>No upcoming appointments.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((dateKey) => {
              const date = new Date(`${dateKey}T00:00:00Z`);
              const appts = [...grouped[dateKey]].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
              return (
                <div key={dateKey} className="bg-white border border-gray-100 rounded-2xl p-6">
                  <h2 className="font-bold text-gray-900 mb-4">
                    {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                  </h2>
                  <div className="space-y-3">
                    {appts.map((a) => (
                      <div key={a.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="text-sm font-semibold text-gray-700 w-16 flex-shrink-0">
                            {new Date(a.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{a.patient}</p>
                            <p className="text-xs text-gray-400">{APPT_TYPE_LABELS[a.type] ?? a.type}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${APPT_STATUS_COLORS[a.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
