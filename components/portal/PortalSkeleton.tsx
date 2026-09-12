// Generic content skeleton shown inside a portal's sidebar shell while a
// page's server-side data fetch is in flight (via Next.js loading.tsx).
export default function PortalSkeleton() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl animate-pulse">
      <div className="h-7 w-56 bg-gray-200 dark:bg-slate-800 rounded-lg mb-2" />
      <div className="h-4 w-80 bg-gray-100 dark:bg-slate-800/70 rounded-lg mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800/70 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800/70 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
