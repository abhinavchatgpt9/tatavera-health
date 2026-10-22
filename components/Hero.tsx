'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarCheck, MessageCircle, Search, ShieldCheck, Wallet, Globe2 } from 'lucide-react';
import { SITE_TAGLINE, QUICK_LINKS, WHATSAPP_NUMBER } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { motion, MagneticButton } from '@/components/ui/motion';
import AppointmentModal from '@/components/AppointmentModal';

const TRUST_PILLS = [
  { icon: ShieldCheck, label: 'JCI Accredited Hospitals' },
  { icon: Wallet, label: '100% Free for Patients' },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
} satisfies import('framer-motion').Variants;
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
} satisfies import('framer-motion').Variants;

export default function Hero() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/treatments?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 py-24 md:py-32">
        {/* Animated gradient mesh — the "alive" background layer */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -top-1/3 left-1/4 h-[700px] w-[700px] rounded-full bg-blue-600/30 blur-[120px]"
            animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/25 blur-[120px]"
            animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-[100px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Fine grid texture, radially masked — Linear/Vercel signature */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)',
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        >

          <motion.h1 variants={item} className="mb-5 bg-gradient-to-b from-white to-slate-300 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-5xl lg:text-6xl">
            {SITE_TAGLINE}
          </motion.h1>

          <motion.p variants={item} className="mx-auto mb-9 max-w-2xl text-lg text-slate-300 md:text-xl">
            We coordinate your treatment journey between <strong className="text-white">Kenya and India</strong>, starting with orthopaedic and spine care.
            <span className="text-slate-400"> Share your case and our team will guide you through the next steps.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mb-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton>
              <Button
                size="lg"
                onClick={() => setModalOpen(true)}
                className="w-full bg-white text-blue-700 shadow-[0_0_30px_-6px_rgba(255,255,255,0.4)] hover:bg-blue-50 hover:shadow-[0_0_40px_-4px_rgba(255,255,255,0.55)] sm:w-auto"
              >
                <CalendarCheck className="h-5 w-5" />
                Book Free Consultation
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">FREE</span>
              </Button>
            </MagneticButton>
            <Button size="lg" variant="outline" asChild className="w-full border-white/15 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/10 sm:w-auto">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I need help with medical treatment abroad.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us Now
              </a>
            </Button>
          </motion.div>

          {/* Trust pills */}
          <motion.div variants={item} className="mb-10 flex flex-wrap justify-center gap-3">
            {TRUST_PILLS.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <p.icon className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                {p.label}
              </span>
            ))}
          </motion.div>

          {/* Search */}
          <motion.form variants={item} onSubmit={handleSearch} className="mx-auto mb-6 max-w-2xl">
            <div className="flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-md transition-all focus-within:border-blue-400/50 focus-within:bg-white/10 focus-within:shadow-[0_0_40px_-8px_rgba(59,130,246,0.6)]">
              <Search className="ml-4 h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search treatment, hospital or doctor…"
                aria-label="Search treatment, hospital or doctor"
                className="flex-1 bg-transparent px-4 py-4 text-base text-white outline-none placeholder-slate-500"
              />
              <Button type="submit" className="m-1.5">
                Search
              </Button>
            </div>
          </motion.form>

          {/* Quick link chips */}
          <motion.div variants={item} className="flex flex-wrap justify-center gap-2">
            {QUICK_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => router.push(`/treatments?q=${encodeURIComponent(link)}`)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-slate-300 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              >
                {link}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <AppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
