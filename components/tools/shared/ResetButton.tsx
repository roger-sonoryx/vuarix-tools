"use client";

import { RotateCcw } from "lucide-react";

export default function ResetButton({ onClick, label = "Limpar" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button"
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition"
    >
      <RotateCcw size={14} />
      {label}
    </button>
  );
}
