"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage, SuccessMessage } from "../shared/Messages";
import PdfDropzone, { LoadedPdf } from "../shared/PdfDropzone";

export default function CompressPdfTool() {
  const [file, setFile] = useState<LoadedPdf | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await file.file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      // pdf-lib não recomprime imagens internas, mas reescreve o PDF com
      // object streams e remove objetos não utilizados/duplicados — reduz
      // o tamanho em PDFs gerados por editores que não otimizam a estrutura.
      const outBytes = await doc.save({ useObjectStreams: true });
      const pdfBuffer = outBytes.buffer.slice(
  outBytes.byteOffset,
  outBytes.byteOffset + outBytes.byteLength
) as ArrayBuffer;

setResult(new Blob([pdfBuffer], { type: "application/pdf" }));
    } catch {
      setError("Não foi possível compactar este PDF. Verifique se não está corrompido ou protegido por senha.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const savings = result && file ? Math.round((1 - result.size / file.file.size) * 100) : null;

  return (
    <ToolPanel>
      {!file && <PdfDropzone files={[]} onAdd={(fs) => { setFile(fs[0]); setResult(null); }} onRemove={() => {}} />}

      {file && (
        <>
          <div className="text-sm mb-4">
            <span className="font-medium">{file.file.name}</span>{" "}
            <span className="text-muted-light dark:text-muted-dark">
              · {(file.file.size / 1024).toFixed(0)} KB
            </span>
          </div>

          <p className="text-xs text-muted-light dark:text-muted-dark mb-4">
            Esta compactação reorganiza a estrutura interna do PDF (remove
            objetos duplicados e usa compressão de fluxo). Ela não recomprime
            imagens já inseridas no documento, então o ganho varia por
            arquivo — PDFs exportados de editores como Word costumam encolher
            mais do que PDFs já otimizados.
          </p>

          <button
            type="button"
            onClick={compress}
            disabled={loading}
            className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Compactar PDF
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Compactando..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && file && (
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            {savings !== null && savings > 0 ? (
              <SuccessMessage>
                Reduzido em {savings}% ({(result.size / 1024).toFixed(0)} KB, era{" "}
                {(file.file.size / 1024).toFixed(0)} KB)
              </SuccessMessage>
            ) : (
              <p className="text-sm text-muted-light dark:text-muted-dark">
                Este PDF já estava com a estrutura otimizada — resultado: {(result.size / 1024).toFixed(0)} KB.
              </p>
            )}
          </div>
          <DownloadButton data={result} filename="compactado.pdf" mimeType="application/pdf" label="Baixar" />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
