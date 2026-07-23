"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import PdfDropzone, { LoadedPdf } from "../shared/PdfDropzone";
import { GripVertical } from "lucide-react";

export default function MergePdfTool() {
  const [files, setFiles] = useState<LoadedPdf[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (newFiles: LoadedPdf[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResult(null);
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const onDragOverItem = (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIndex(i);
  };

  const merge = async () => {
    if (files.length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const { file } of files) {
        const bytes = await file.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(src, src.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }

      const mergedBytes = await mergedPdf.save();
      const pdfBuffer = mergedBytes.buffer.slice(
  mergedBytes.byteOffset,
  mergedBytes.byteOffset + mergedBytes.byteLength
) as ArrayBuffer;

setResult(new Blob([pdfBuffer], { type: "application/pdf" }));
    } catch {
      setError("Não foi possível unir estes PDFs. Verifique se os arquivos não estão corrompidos ou protegidos por senha.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  return (
    <ToolPanel>
      <PdfDropzone files={[]} onAdd={addFiles} onRemove={() => {}} multiple />

      {files.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-muted-light dark:text-muted-dark mb-2">
            {files.length} arquivo{files.length > 1 ? "s" : ""} · arraste para reordenar
          </div>
          <div className="rounded-xl border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
            {files.map((f, i) => (
              <div
                key={f.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOverItem(i);
                }}
                onDragEnd={() => setDragIndex(null)}
                className="flex items-center gap-3 px-4 py-3 cursor-move bg-white dark:bg-surface-dark-alt"
              >
                <GripVertical size={15} className="text-muted-light dark:text-muted-dark shrink-0" />
                <span className="text-xs font-mono text-muted-light dark:text-muted-dark w-5 shrink-0">{i + 1}</span>
                <span className="text-sm truncate flex-1">{f.file.name}</span>
                <span className="text-xs text-muted-light dark:text-muted-dark shrink-0">
                  {(f.file.size / 1024).toFixed(0)} KB
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  aria-label="Remover"
                  className="shrink-0 opacity-60 hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={merge}
            disabled={files.length < 2 || loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Unir {files.length} PDFs
          </button>
          {files.length < 2 && (
            <p className="text-xs text-muted-light dark:text-muted-dark mt-2">
              Adicione pelo menos 2 arquivos para unir.
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Unindo arquivos..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5">
          <DownloadButton data={result} filename="documento-unido.pdf" mimeType="application/pdf" label="Baixar PDF unido" />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
