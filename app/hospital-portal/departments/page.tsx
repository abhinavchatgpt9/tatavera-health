import type { Metadata } from 'next';
import HospitalLayout from '@/components/HospitalLayout';
import { MOCK_HOSPITAL_DEPARTMENTS } from '@/lib/portal-mock-data';

export const metadata: Metadata = { title: 'Departments | Tatavera Health' };

export default function HospitalDepartmentsPage() {
  return (
    <HospitalLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-500 mt-1">{MOCK_HOSPITAL_DEPARTMENTS.length} departments</p>
          </div>
          <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
            + Add Department
          </button>
        </div>

        {MOCK_HOSPITAL_DEPARTMENTS.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🏢</p>
            <p>No departments yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_HOSPITAL_DEPARTMENTS.map((dept) => (
              <div key={dept.id} className="bg-white border border-gray-100 rounded-2xl p-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg mb-3">
                  🏢
                </div>
                <h2 className="font-bold text-gray-900">{dept.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Head: {dept.headDoctor}</p>
                <p className="text-xs text-gray-400 mt-3">{dept.doctorCount} doctors</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </HospitalLayout>
  );
}
