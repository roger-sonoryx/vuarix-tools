"use client";

import { Download } from "lucide-react";

// Recebe um Blob (ou string) e cuida da criação/revogação do object URL,
// evitando vazamento de memória, conforme exigido pela especificação.
export default function DownloadButton({
  data,
  filename,
  mimeType = "text/plain",
  label = "Baixar",
  disabled = false,
}: {
  data: string | Blob | null;
  filename: string;
  mimeType?: string;
  label?: string;
  disabled?: boolean;
}) {
  const handleDownload = () => {
    if (!data) return;
    const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Pequeno atraso antes de revogar: alguns navegadores ainda estão
    // processando o download no momento do clique.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || !data}
      aria-label={label}
      className="flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download size={14} />
      {label}
    </button>
  );
}
