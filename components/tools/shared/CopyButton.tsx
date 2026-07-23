"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";

export default function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setFailed(true);
      setTimeout(() => setFailed(false), 2500);
    }
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={handleCopy}
        disabled={!value}
        aria-label={label}
        className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {copied ? <Check size={14} /> : failed ? <AlertCircle size={14} /> : <Copy size={14} />}
        {copied ? "Copiado!" : failed ? "Falhou" : label}
      </button>
      {failed && (
        <span role="alert" className="text-xs text-feedback-error">
          Não foi possível copiar. Copie o texto manualmente.
        </span>
      )}
    </div>
  );
}
