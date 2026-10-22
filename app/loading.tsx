export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400 dark:text-slate-500">Loading…</p>
      </div>
    </div>
  );
}
