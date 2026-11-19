'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PhoneCall, MessageCircle, Search, Wallet, Clock, Lock } from 'lucide-react';
import { SITE_TAGLINE, HOME_H1, QUICK_LINKS, WHATSAPP_NUMBER, CALLBACK_TIMEFRAME, CONTACT_PHONE, CONTACT_PHONE_TEL } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { motion, MagneticButton } from '@/components/ui/motion';

const TRUST_PILLS = [
  { icon: Wallet, label: 'Free enquiry review' },
  { icon: Clock, label: `Callback ${CALLBACK_TIMEFRAME}` },
  { icon: Lock, label: 'Your details stay private' },
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
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/treatments?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-100/80 via-white to-teal-50 pb-24 pt-16 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 md:pb-32 md:pt-24">
        {/* Lobby photo: full-bleed on desktop, faded into the page colour so the headline stays readable */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden w-[68%] lg:block"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 22%, black 48%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 22%, black 48%)',
          }}
        >
          <Image unoptimized src="/images/hospital-lobby.jpg" alt="" fill priority sizes="68vw" className="object-cover object-[60%_50%] dark:opacity-55" />
        </div>
        {/* Soft colour washes + fine dot texture */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-500/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full bg-teal-200/50 blur-3xl dark:bg-teal-400/[0.07]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-30 lg:hidden"
          style={{
            backgroundImage: 'radial-gradient(rgba(37,99,235,0.16) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 100%)',
          }}
        />
        {/* ECG trace draws in once on load, then rests */}
        <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full text-blue-500/40 dark:text-blue-300/25 md:h-14">
          <path
            className="pulse-line"
            pathLength={1}
            d="M0 36 H520 L548 36 L566 12 L592 52 L612 4 L634 36 H700 L716 30 L736 36 H1440"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={container} className="max-w-xl text-left lg:py-6">
            <motion.h1 variants={item} className="mb-5 max-w-xl text-balance text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-[3.4rem]">
              {HOME_H1}
            </motion.h1>
            <motion.p variants={item} className="-mt-2 mb-5 text-lg font-semibold text-blue-700 dark:text-blue-300">
              {SITE_TAGLINE}
            </motion.p>

            <motion.p variants={item} className="mb-8 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              We help patients from <strong className="font-semibold text-slate-900 dark:text-white">around the world</strong> find the right hospital and doctor in India, for any treatment need. Share your case and our team will guide you through the next steps.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="mb-6 flex flex-col gap-3 sm:flex-row">
              <MagneticButton>
                <Button
                  size="lg"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href="/free-consultation">
                    <PhoneCall className="h-5 w-5" />
                    Request a callback
                  </Link>
                </Button>
              </MagneticButton>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I need help with medical treatment abroad.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp us
                </a>
              </Button>
            </motion.div>

            {/* Trust pills */}
            <motion.div variants={item} className="mb-9 flex flex-wrap gap-2.5">
              {TRUST_PILLS.map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
                >
                  <p.icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  {p.label}
                </span>
              ))}
            </motion.div>

            {/* Search */}
            <motion.form variants={item} onSubmit={handleSearch} className="mb-4 max-w-xl">
              <div className="flex items-center overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-white/15 dark:bg-white/[0.07]">
                <Search className="ml-4 h-5 w-5 flex-shrink-0 text-slate-500" aria-hidden="true" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search treatment, hospital or doctor"
                  aria-label="Search treatment, hospital or doctor"
                  className="min-w-0 flex-1 !bg-transparent px-3 py-4 text-base !text-slate-900 outline-none placeholder:!text-slate-500 dark:!text-white"
                />
                <Button type="submit" className="m-1.5">
                  Search
                </Button>
              </div>
            </motion.form>

            {/* Quick link chips */}
            <motion.div variants={item} className="flex max-w-xl flex-wrap gap-2">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => router.push(`/treatments?q=${encodeURIComponent(link)}`)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {link}
                </button>
              ))}
            </motion.div>

            <motion.p variants={item} className="mt-6 text-sm text-slate-600 dark:text-slate-400">
              Prefer to talk? Call or WhatsApp{' '}
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white">
                {CONTACT_PHONE}
              </a>
            </motion.p>
          </motion.div>

          <div className="relative mt-10 overflow-hidden rounded-3xl shadow-[0_20px_50px_-24px_rgba(15,23,42,0.45)] lg:hidden">
            <Image unoptimized src="/images/hospital-lobby.jpg" alt="Bright, welcoming hospital reception area" width={1600} height={900} sizes="100vw" className="h-56 w-full object-cover object-[70%_50%] sm:h-72" />
          </div>

        </div>
      </section>

    </>
  );
}
