import { AlertCircle, CheckCircle2 } from "lucide-react";

export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-2 rounded-lg border border-feedback-error/30 bg-feedback-error/10 px-4 py-3 text-sm text-feedback-error"
    >
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

export function SuccessMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-2 rounded-lg border border-feedback-success/30 bg-feedback-success/10 px-4 py-3 text-sm text-feedback-success"
    >
      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}
