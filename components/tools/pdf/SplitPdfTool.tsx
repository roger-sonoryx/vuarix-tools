"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import PdfDropzone, { LoadedPdf } from "../shared/PdfDropzone";
import { parsePageRanges } from "../shared/pageRanges";

type SplitResult = {
  label: string;
  blob: Blob;
};

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

    if (!f) return;

    setFile(f);
    setResults([]);
    setError(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await f.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      setPageCount(doc.getPageCount());
    } catch {
      setError(
        "Não foi possível ler este PDF. Verifique se não está corrompido ou protegido por senha."
      );
      setPageCount(null);
    }
  };

  const split = async () => {
    if (!file || !pageCount) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.file.arrayBuffer();
      const src = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
      });

      const groups: {
        label: string;
        indices: number[];
      }[] = [];

      if (mode === "each") {
        for (let i = 0; i < pageCount; i++) {
          groups.push({
            label: `pagina-${i + 1}.pdf`,
            indices: [i],
          });
        }
      } else {
        const parsed = parsePageRanges(ranges, pageCount);

        if ("error" in parsed) {
          setError(parsed.error);
          return;
        }

        groups.push({
          label: "paginas-selecionadas.pdf",
          indices: parsed.map((page) => page - 1),
        });
      }

      const newResults: SplitResult[] = [];

      for (const group of groups) {
        const newDoc = await PDFDocument.create();

        const pages = await newDoc.copyPages(src, group.indices);

        pages.forEach((page) => {
          newDoc.addPage(page);
        });

        const outBytes = await newDoc.save();

        const pdfBuffer = outBytes.buffer.slice(
          outBytes.byteOffset,
          outBytes.byteOffset + outBytes.byteLength
        ) as ArrayBuffer;

        const blob = new Blob([pdfBuffer], {
          type: "application/pdf",
        });

        newResults.push({
          label: group.label,
          blob,
        });
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
    setMode("each");
  };

  return (
    <ToolPanel>
      {!file && (
        <PdfDropzone
          files={[]}
          onAdd={handleAdd}
          onRemove={() => {}}
        />
      )}

      {file && pageCount !== null && (
        <>
          <div className="mb-4 text-sm">
            <span className="font-medium">{file.file.name}</span>{" "}
            <span className="text-muted-light dark:text-muted-dark">
              · {pageCount} página(s)
            </span>
          </div>

          <div className="mb-4 flex gap-2">
            {(["each", "ranges"] as const).map((currentMode) => (
              <button
                key={currentMode}
                type="button"
                onClick={() => {
                  setMode(currentMode);
                  setResults([]);
                  setError(null);
                }}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  mode === currentMode
                    ? "border-action bg-action text-white"
                    : "border-border-light hover:opacity-70 dark:border-border-dark"
                }`}
              >
                {currentMode === "each"
                  ? "Uma página por arquivo"
                  : "Escolher intervalo"}
              </button>
            ))}
          </div>

          {mode === "ranges" && (
            <div>
              <label
                htmlFor="split-ranges"
                className="mb-1.5 block text-sm font-medium"
              >
                Páginas (ex: 1-3,5,8-10)
              </label>

              <input
                id="split-ranges"
                value={ranges}
                onChange={(event) => {
                  setRanges(event.target.value);
                  setResults([]);
                  setError(null);
                }}
                placeholder={`1-${pageCount}`}
                className="w-full rounded-xl border border-border-light bg-surface-light px-4 py-2.5 font-mono text-sm outline-none transition focus:border-action dark:border-border-dark dark:bg-surface-dark"
              />
            </div>
          )}

          <button
            type="button"
            onClick={split}
            disabled={loading || (mode === "ranges" && !ranges.trim())}
            className="mt-4 rounded-lg bg-action px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {results.map((result) => (
            <div
              key={result.label}
              className="flex items-center justify-between gap-2 rounded-lg border border-border-light px-3 py-2 dark:border-border-dark"
            >
              <span className="truncate text-sm">{result.label}</span>

              <DownloadButton
                data={result.blob}
                filename={result.label}
                mimeType="application/pdf"
                label="Baixar"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <ResetButton
          onClick={clear}
          label="Limpar tudo"
        />
      </div>
    </ToolPanel>
  );
}