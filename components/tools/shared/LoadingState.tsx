import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Processando..." }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 text-sm text-muted-light dark:text-muted-dark"
    >
      <Loader2 size={16} className="animate-spin" />
      {label}
    </div>
  );
}
