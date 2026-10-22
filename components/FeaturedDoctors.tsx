'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TOP_DOCTORS } from '@/lib/hospitals-data';
import AppointmentModal from '@/components/AppointmentModal';
import AnimateIn from '@/components/AnimateIn';

const featured = TOP_DOCTORS.slice(0, 6);

export default function FeaturedDoctors() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>();

  const openBooking = (doctorName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedDoctor(doctorName);
    setModalOpen(true);
  };

  if (featured.length === 0) return null;

  return (
    <>
      <section className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn variant="fade-up">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="section-label">Expert Surgeons</span>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">Top-Rated Specialists</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1.5">Internationally trained, personally matched to your condition</p>
              </div>
              <Link href="/doctors" className="hidden md:inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm">
                View All Doctors →
              </Link>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((doctor, i) => (
              <AnimateIn key={doctor.slug} variant="fade-up" delay={i * 80}>
                <div className="flashcard group p-5 h-full flex flex-col">
                  <div className="flex gap-4 mb-4">
                    {/* Avatar */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-blue-50 dark:bg-slate-800 ring-2 ring-blue-100 dark:ring-slate-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-300">
                      <Image src={doctor.image} alt={doctor.name} fill className="object-cover" sizes="64px" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <Link href={`/doctors/${doctor.slug}`}
                          className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-tight hover:underline">
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

                  {/* Stats */}
                  <div className="flex items-center gap-3 mb-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{doctor.rating}</span>
                      <span>({doctor.reviewCount.toLocaleString()})</span>
                    </span>
                    <span className="text-slate-200 dark:text-slate-700">|</span>
                    <span>{doctor.experience} yrs</span>
                    <span className="text-slate-200 dark:text-slate-700">|</span>
                    <span>{doctor.totalSurgeries} procedures</span>
                  </div>

                  {/* Awards */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doctor.awards.slice(0, 2).map((award) => (
                      <span key={award}
                        className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs rounded-full border border-amber-200 dark:border-amber-800 truncate max-w-[160px]"
                        title={award}>
                        🏅 {award}
                      </span>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-1 mb-4 text-xs text-slate-400 dark:text-slate-500">
                    <span>🌐</span>
                    {doctor.languages.join(' · ')}
                  </div>

                  <button
                    onClick={(e) => openBooking(doctor.name, e)}
                    className="mt-auto w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-blue-500/20 active:scale-95"
                  >
                    📅 Book Consultation — Free
                  </button>
                </div>
              </AnimateIn>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/doctors" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">
              View All Doctors →
            </Link>
          </div>
        </div>
      </section>

      <AppointmentModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedDoctor(undefined); }}
        preselectedDoctor={selectedDoctor}
      />
    </>
  );
}
