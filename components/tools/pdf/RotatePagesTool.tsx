"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import PdfDropzone, { LoadedPdf } from "../shared/PdfDropzone";
import { parsePageRanges } from "../shared/pageRanges";
import { RotateCw, RotateCcw } from "lucide-react";

export default function RotatePagesTool() {
  const [file, setFile] = useState<LoadedPdf | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [scope, setScope] = useState<"all" | "selected">("all");
  const [ranges, setRanges] = useState("");
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);
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
      setPageCount(doc.getPageCount());
    } catch {
      setError("Não foi possível ler este PDF. Verifique se não está corrompido ou protegido por senha.");
    }
  };

  const rotate = async () => {
    if (!file || !pageCount) return;

    let targetIndices: number[];
    if (scope === "all") {
      targetIndices = Array.from({ length: pageCount }, (_, i) => i);
    } else {
      const parsed = parsePageRanges(ranges, pageCount);
      if ("error" in parsed) {
        setError(parsed.error);
        return;
      }
      targetIndices = parsed.map((p) => p - 1);
    }

    setLoading(true);
    setError(null);
    try {
      const { PDFDocument, degrees: degreesHelper } = await import("pdf-lib");
      const bytes = await file.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();

      for (const idx of targetIndices) {
        const page = pages[idx];
        const current = page.getRotation().angle;
        page.setRotation(degreesHelper((current + degrees) % 360));
      }

      const outBytes = await doc.save();
      const pdfBuffer = outBytes.buffer.slice(
  outBytes.byteOffset,
  outBytes.byteOffset + outBytes.byteLength
) as ArrayBuffer;

setResult(new Blob([pdfBuffer], { type: "application/pdf" }));
    } catch {
      setError("Não foi possível girar as páginas.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setPageCount(null);
    setRanges("");
    setResult(null);
    setError(null);
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
            {(["all", "selected"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
                  scope === s
                    ? "bg-action text-white border-action"
                    : "border-border-light dark:border-border-dark hover:opacity-70"
                }`}
              >
                {s === "all" ? "Todas as páginas" : "Páginas específicas"}
              </button>
            ))}
          </div>

          {scope === "selected" && (
            <input
              value={ranges}
              onChange={(e) => setRanges(e.target.value)}
              placeholder={`ex: 1-3,5`}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition font-mono mb-4"
            />
          )}

          <label className="block text-sm font-medium mb-2">Direção</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDegrees(90)}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition ${
                degrees === 90 ? "bg-action text-white border-action" : "border-border-light dark:border-border-dark hover:opacity-70"
              }`}
            >
              <RotateCw size={14} />
              90°
            </button>
            <button
              type="button"
              onClick={() => setDegrees(180)}
              className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
                degrees === 180 ? "bg-action text-white border-action" : "border-border-light dark:border-border-dark hover:opacity-70"
              }`}
            >
              180°
            </button>
            <button
              type="button"
              onClick={() => setDegrees(270)}
              className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition ${
                degrees === 270 ? "bg-action text-white border-action" : "border-border-light dark:border-border-dark hover:opacity-70"
              }`}
            >
              <RotateCcw size={14} />
              90° (esquerda)
            </button>
          </div>

          <button
            type="button"
            onClick={rotate}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Girar páginas
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Girando páginas..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5">
          <DownloadButton data={result} filename="girado.pdf" mimeType="application/pdf" label="Baixar PDF" />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
