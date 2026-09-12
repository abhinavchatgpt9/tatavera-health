'use client';

import { useEffect, useState, useCallback } from 'react';

interface Notification {
  name: string;
  country: string;
  flag: string;
  action: string;
  time: string;
  avatar: string;
}

const NOTIFICATIONS: Notification[] = [
  { name: 'Ahmed K.', country: 'Nigeria', flag: '🇳🇬', action: 'just booked a cardiac consultation', time: '2 min ago', avatar: '👨🏿' },
  { name: 'Fatima A.', country: 'Egypt', flag: '🇪🇬', action: 'received a hospital match for IVF', time: '5 min ago', avatar: '👩🏽' },
  { name: 'Sergei M.', country: 'Russia', flag: '🇷🇺', action: 'got a free cost estimate for spine surgery', time: '8 min ago', avatar: '👨🏼' },
  { name: 'Grace O.', country: 'Ghana', flag: '🇬🇭', action: 'booked a knee replacement at Apollo', time: '12 min ago', avatar: '👩🏿' },
  { name: 'Mohammed R.', country: 'Kuwait', flag: '🇰🇼', action: 'connected with a liver transplant specialist', time: '15 min ago', avatar: '👨🏽' },
  { name: 'Amara D.', country: 'Senegal', flag: '🇸🇳', action: 'started treatment planning for cancer care', time: '18 min ago', avatar: '👩🏿' },
  { name: 'Ali H.', country: 'UAE', flag: '🇦🇪', action: 'saved 82% on heart bypass vs UK price', time: '22 min ago', avatar: '👨🏽' },
  { name: 'Ifeoma N.', country: 'Nigeria', flag: '🇳🇬', action: 'received visa invitation letter', time: '25 min ago', avatar: '👩🏿' },
  { name: 'Olena V.', country: 'Ukraine', flag: '🇺🇦', action: 'booked a bone marrow transplant consult', time: '30 min ago', avatar: '👩🏼' },
  { name: 'Khalid T.', country: 'Saudi Arabia', flag: '🇸🇦', action: 'got matched with Dr. Naresh Trehan', time: '35 min ago', avatar: '👨🏽' },
];

export default function SocialProofNotification() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<Notification | null>(null);
  const [index, setIndex] = useState(0);

  const showNext = useCallback(() => {
    const shuffled = [...NOTIFICATIONS].sort(() => Math.random() - 0.5);
    setCurrent(shuffled[index % shuffled.length]);
    setIndex((i) => i + 1);
    setVisible(true);
    setTimeout(() => setVisible(false), 4500);
  }, [index]);

  useEffect(() => {
    // First notification after 6 seconds
    const initial = setTimeout(showNext, 6000);
    return () => clearTimeout(initial);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!visible) {
      // Show next notification 20–35 seconds after hiding
      const delay = 20000 + Math.random() * 15000;
      const timer = setTimeout(showNext, delay);
      return () => clearTimeout(timer);
    }
  }, [visible, showNext]);

  if (!current) return null;

  return (
    <div
      className={`fixed bottom-24 left-4 sm:left-6 z-40 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3 max-w-xs">
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl flex-shrink-0">
          {current.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">
            {current.name} {current.flag}
            <span className="text-gray-400 font-normal"> · {current.time}</span>
          </p>
          <p className="text-xs text-gray-600 leading-snug mt-0.5 line-clamp-2">{current.action}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-300 hover:text-gray-500 ml-1 flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
