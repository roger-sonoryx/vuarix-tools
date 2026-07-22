"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setFailed(true);
      setTimeout(() => setFailed(false), 2500);
    }
  };

  return (
    <button type="button"
      onClick={handleCopy}
      disabled={!value}
      aria-label={label}
      className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {failed ? "Falha ao copiar" : copied ? "Copiado!" : label}
    </button>
  );
}
