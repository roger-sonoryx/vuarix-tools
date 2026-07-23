"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import PdfDropzone, { LoadedPdf } from "../shared/PdfDropzone";
import { GripVertical } from "lucide-react";

export default function OrganizePagesTool() {
  const [file, setFile] = useState<LoadedPdf | null>(null);
  const [order, setOrder] = useState<number[]>([]); // 1-based, ordem atual editável
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (files: LoadedPdf[]) => {
    const f = files[0];
    setFile(f);
    setResult(null);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setOrder(Array.from({ length: count }, (_, i) => i + 1));
    } catch {
      setError("Não foi possível ler este PDF. Verifique se não está corrompido ou protegido por senha.");
    }
  };

  const onDragOverItem = (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    setOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIndex(i);
  };

  const apply = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(src, order.map((n) => n - 1));
      pages.forEach((p) => newDoc.addPage(p));
      const outBytes = await newDoc.save();
      setResult(new Blob([outBytes] as BlobPart[], { type: "application/pdf" }));
    } catch {
      setError("Não foi possível reorganizar as páginas.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setOrder([]);
    setResult(null);
    setError(null);
  };

  return (
    <ToolPanel>
      {!file && <PdfDropzone files={[]} onAdd={handleAdd} onRemove={() => {}} />}

      {file && order.length > 0 && (
        <>
          <div className="text-sm mb-3">
            <span className="font-medium">{file.file.name}</span>{" "}
            <span className="text-muted-light dark:text-muted-dark">· {order.length} página(s) · arraste para reordenar</span>
          </div>

          <div className="rounded-xl border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden max-h-80 overflow-y-auto">
            {order.map((pageNum, i) => (
              <div
                key={`${pageNum}-${i}`}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOverItem(i);
                }}
                onDragEnd={() => setDragIndex(null)}
                className="flex items-center gap-3 px-4 py-2.5 cursor-move bg-white dark:bg-surface-dark-alt"
              >
                <GripVertical size={15} className="text-muted-light dark:text-muted-dark shrink-0" />
                <span className="text-sm">
                  Posição {i + 1} <span className="text-muted-light dark:text-muted-dark">→ página original {pageNum}</span>
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={apply}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Aplicar nova ordem
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Reorganizando..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5">
          <DownloadButton data={result} filename="reorganizado.pdf" mimeType="application/pdf" label="Baixar PDF" />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
