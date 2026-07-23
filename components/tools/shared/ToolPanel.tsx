export default function ToolPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark-alt p-5 sm:p-6">
      {children}
    </div>
  );
}
