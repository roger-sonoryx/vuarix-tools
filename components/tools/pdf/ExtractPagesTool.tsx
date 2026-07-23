"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import PdfDropzone, { LoadedPdf } from "../shared/PdfDropzone";
import { parsePageRanges } from "../shared/pageRanges";

export default function ExtractPagesTool() {
  const [file, setFile] = useState<LoadedPdf | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [ranges, setRanges] = useState("");
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

  const extract = async () => {
    if (!file || !pageCount) return;
    const parsed = parsePageRanges(ranges, pageCount);
    if ("error" in parsed) {
      setError(parsed.error);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.file.arrayBuffer();
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(src, parsed.map((p) => p - 1));
      pages.forEach((p) => newDoc.addPage(p));
      const outBytes = await newDoc.save();
      const pdfBuffer = outBytes.buffer.slice(
  outBytes.byteOffset,
  outBytes.byteOffset + outBytes.byteLength
) as ArrayBuffer;

setResult(new Blob([pdfBuffer], { type: "application/pdf" }));
    } catch {
      setError("Não foi possível extrair estas páginas.");
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

          <label htmlFor="extract-ranges" className="block text-sm font-medium mb-1.5">
            Páginas a extrair (ex: 1-3,5,8-10)
          </label>
          <input
            id="extract-ranges"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder={`1-${pageCount}`}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition font-mono"
          />

          <button
            type="button"
            onClick={extract}
            disabled={loading || !ranges.trim()}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Extrair páginas
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Extraindo..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5">
          <DownloadButton data={result} filename="paginas-extraidas.pdf" mimeType="application/pdf" label="Baixar PDF" />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
