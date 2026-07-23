"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import PdfDropzone, { LoadedPdf } from "../shared/PdfDropzone";
import { parsePageRanges } from "../shared/pageRanges";

type SplitResult = { label: string; blob: Blob };

export default function SplitPdfTool() {
  const [file, setFile] = useState<LoadedPdf | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<"each" | "ranges">("each");
  const [ranges, setRanges] = useState("");
  const [results, setResults] = useState<SplitResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (files: LoadedPdf[]) => {
    const f = files[0];
    setFile(f);
    setResults([]);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch {
      setError("Não foi possível ler este PDF. Verifique se não está corrompido ou protegido por senha.");
      setPageCount(null);
    }
  };

  const split = async () => {
    if (!file || !pageCount) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });

      const groups: { label: string; indices: number[] }[] = [];

      if (mode === "each") {
        for (let i = 0; i < pageCount; i++) {
          groups.push({ label: `pagina-${i + 1}.pdf`, indices: [i] });
        }
      } else {
        const parsed = parsePageRanges(ranges, pageCount);
        if ("error" in parsed) {
          setError(parsed.error);
          setLoading(false);
          return;
        }
        groups.push({ label: `paginas-selecionadas.pdf`, indices: parsed.map((p) => p - 1) });
      }

      const newResults: SplitResult[] = [];
      for (const group of groups) {
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(src, group.indices);
        pages.forEach((p) => newDoc.addPage(p));
        const outBytes = await newDoc.save();
        newResults.push({ label: group.label, blob: new Blob([outBytes] as BlobPart[], { type: "application/pdf" }) });
      }
      setResults(newResults);
    } catch {
      setError("Não foi possível dividir este PDF.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setPageCount(null);
    setResults([]);
    setError(null);
    setRanges("");
  };

  return (
    <ToolPanel>
      {!file && <PdfDropzone files={[]} onAdd={handleAdd} onRemove={() => {}} />}

      {file && pageCount !== null && (
        <>
          <div className="text-sm mb-4">
            <span className="font-medium">{file.file.name}</span>{" "}
            <span className="text-muted-light dark:text-muted-dark">· {pageCount} página(s)</span>
          </div>

          <div className="flex gap-2 mb-4">
            {(["each", "ranges"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
                  mode === m
                    ? "bg-action text-white border-action"
                    : "border-border-light dark:border-border-dark hover:opacity-70"
                }`}
              >
                {m === "each" ? "Uma página por arquivo" : "Escolher intervalo"}
              </button>
            ))}
          </div>

          {mode === "ranges" && (
            <div>
              <label htmlFor="split-ranges" className="block text-sm font-medium mb-1.5">
                Páginas (ex: 1-3,5,8-10)
              </label>
              <input
                id="split-ranges"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder={`1-${pageCount}`}
                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition font-mono"
              />
            </div>
          )}

          <button
            type="button"
            onClick={split}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Dividir PDF
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Dividindo..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {results.map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between gap-2 rounded-lg border border-border-light dark:border-border-dark px-3 py-2"
            >
              <span className="text-sm truncate">{r.label}</span>
              <DownloadButton data={r.blob} filename={r.label} mimeType="application/pdf" label="Baixar" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
