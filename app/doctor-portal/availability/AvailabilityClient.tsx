'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/portal/PortalPage';

type Slot = { id: string; startTime: string; endTime: string; slotMins: number };
type Day = { dayOfWeek: number; day: string; slots: Slot[]; label: string };

export function AvailabilityClient({ days }: { days: Day[] }) {
  const router = useRouter();
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [slotMins, setSlotMins] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addSlot(dayOfWeek: number) {
    setError(null);

    if (endTime <= startTime) {
      setError('End time must be after the start time.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/doctor/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dayOfWeek, startTime, endTime, slotMins, active: true }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? 'Could not add the slot.');
        return;
      }

      setOpenDay(null);
      router.refresh();
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function removeSlot(id: string) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/doctor/availability/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? 'Could not remove the slot.');
        return;
      }

      router.refresh();
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="space-y-4">
        {days.map((day) => (
          <Panel
            key={day.dayOfWeek}
            title={day.day}
            actions={
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setOpenDay(openDay === day.dayOfWeek ? null : day.dayOfWeek);
                  setError(null);
                }}
                aria-expanded={openDay === day.dayOfWeek}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add slot
              </Button>
            }
          >
            {day.slots.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Unavailable</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {day.slots.map((slot) => (
                  <li
                    key={slot.id}
                    className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span>
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{slot.slotMins} min</span>
                    <button
                      type="button"
                      onClick={() => removeSlot(slot.id)}
                      disabled={busy}
                      aria-label={`Remove ${day.day} ${slot.startTime} to ${slot.endTime}`}
                      className="rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-red-600 disabled:opacity-50 dark:hover:bg-slate-700"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {openDay === day.dayOfWeek && (
              <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div>
                  <label htmlFor={`start-${day.dayOfWeek}`} className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    From
                  </label>
                  <input
                    id={`start-${day.dayOfWeek}`}
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor={`end-${day.dayOfWeek}`} className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    To
                  </label>
                  <input
                    id={`end-${day.dayOfWeek}`}
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor={`mins-${day.dayOfWeek}`} className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Slot length
                  </label>
                  <select
                    id={`mins-${day.dayOfWeek}`}
                    value={slotMins}
                    onChange={(e) => setSlotMins(Number(e.target.value))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  >
                    {[15, 20, 30, 45, 60].map((m) => (
                      <option key={m} value={m}>
                        {m} min
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={() => addSlot(day.dayOfWeek)} loading={busy}>
                  Save
                </Button>
              </div>
            )}
          </Panel>
        ))}
      </div>
    </>
  );
}
