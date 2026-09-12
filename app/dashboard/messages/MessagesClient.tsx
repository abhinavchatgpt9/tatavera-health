'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/components/portal/PortalPage';

type Message = {
  id: string;
  body: string;
  senderName: string;
  isMine: boolean;
  createdAt: string;
};

export function MessagesClient({
  caseId,
  messages,
  caseManagerName,
}: {
  caseId: string;
  messages: Message[];
  caseManagerName: string | null;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view when the thread loads or grows.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ caseId, body }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? 'Could not send your message.');
        return;
      }

      setDraft('');
      router.refresh();
    } catch {
      setError('Network error — check your connection and try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[32rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <p className="font-semibold text-slate-900 dark:text-white">
          {caseManagerName ?? 'Your care team'}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Usually replies within a few hours during business hours in India.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
            No messages yet. Ask anything — about costs, hospitals, visas or travel.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  m.isMine
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                {!m.isMine && (
                  <p className="mb-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{m.senderName}</p>
                )}
                <p className="whitespace-pre-wrap text-sm">{m.body}</p>
                <time
                  dateTime={m.createdAt}
                  className={`mt-1 block text-[0.65rem] ${m.isMine ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}
                >
                  {formatDateTime(m.createdAt)}
                </time>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <p role="alert" className="border-t border-red-100 bg-red-50 px-5 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-100 p-4 dark:border-slate-800">
        <label htmlFor="message-body" className="sr-only">
          Your message
        </label>
        <textarea
          id="message-body"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSubmit(e);
            }
          }}
          rows={1}
          placeholder="Type a message… (Enter to send, Shift+Enter for a new line)"
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <Button type="submit" loading={sending} disabled={!draft.trim()} aria-label="Send message">
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
