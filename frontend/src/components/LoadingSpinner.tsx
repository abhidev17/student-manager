export default function LoadingSpinner() {
  return (
    <div className="glass-panel rounded-2xl flex flex-col items-center justify-center py-16">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 border-r-blue-600 animate-spin"></div>
      </div>
      <p className="text-slate-600 font-semibold">Loading students...</p>
    </div>
  );
}
