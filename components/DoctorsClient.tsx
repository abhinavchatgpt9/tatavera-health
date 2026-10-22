'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppointmentModal from '@/components/AppointmentModal';
import { TOP_DOCTORS } from '@/lib/hospitals-data';
import { SPECIALTIES } from '@/lib/constants';

interface DoctorsClientProps {
  specialtyFilter: string;
}

export default function DoctorsClient({ specialtyFilter }: DoctorsClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>();

  const filtered = TOP_DOCTORS.filter((d) =>
    !specialtyFilter || d.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
  );

  const openBooking = (name: string) => {
    setSelectedDoctor(name);
    setModalOpen(true);
  };

  return (
    <>
      {/* Specialty filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/doctors" className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!specialtyFilter ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}>
          All Specialties
        </Link>
        {SPECIALTIES.slice(0, 8).map((s) => (
          <Link
            key={s.slug}
            href={`/doctors?specialty=${encodeURIComponent(s.name)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${specialtyFilter === s.name ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
          >
            {s.emoji} {s.name}
          </Link>
        ))}
      </div>

      {specialtyFilter && (
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Showing <strong className="text-slate-800 dark:text-white">{filtered.length} doctor{filtered.length !== 1 ? 's' : ''}</strong> in {specialtyFilter}
        </p>
      )}

      {filtered.length === 0 && (
        <p className="text-center py-16 text-slate-500 dark:text-slate-400">Doctor profiles will be listed here once confirmed.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((doctor) => (
          <div key={doctor.slug} className="flashcard group p-5 flex flex-col">
            <div className="flex gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-blue-50 dark:bg-slate-800 ring-2 ring-blue-100 dark:ring-slate-700">
                <Image src={doctor.image} alt={doctor.name} fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <Link href={`/doctors/${doctor.slug}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm leading-tight">
                    {doctor.name}
                  </Link>
                  {doctor.available && (
                    <span className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Available
                    </span>
                  )}
                </div>
                <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold mt-0.5">{doctor.specialty}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 truncate">{doctor.hospital}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{doctor.rating}</span>
                <span>({doctor.reviewCount.toLocaleString()})</span>
              </span>
              <span className="text-slate-200 dark:text-slate-700">|</span>
              <span>{doctor.experience} yrs exp</span>
              <span className="text-slate-200 dark:text-slate-700">|</span>
              <span>{doctor.totalSurgeries} procedures</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {doctor.awards.slice(0, 2).map((award) => (
                <span key={award}
                  className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs rounded-full border border-amber-200 dark:border-amber-800 truncate max-w-[180px]"
                  title={award}>
                  🏅 {award}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 mb-4 text-xs text-slate-400 dark:text-slate-500">
              <span>🌐</span> {doctor.languages.join(' · ')}
            </div>

            <button
              onClick={() => openBooking(doctor.name)}
              className="mt-auto w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
            >
              📅 Book Free Consultation
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <p className="text-slate-400 text-lg mb-4">No doctors found for this specialty.</p>
          <Link href="/doctors" className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">
            View All Doctors
          </Link>
        </div>
      )}

      <AppointmentModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedDoctor(undefined); }}
        preselectedDoctor={selectedDoctor}
      />
    </>
  );
}
