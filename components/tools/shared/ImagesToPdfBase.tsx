"use client";

import { useState } from "react";
import ToolPanel from "./ToolPanel";
import DownloadButton from "./DownloadButton";
import ResetButton from "./ResetButton";
import LoadingState from "./LoadingState";
import { ErrorMessage } from "./Messages";
import { UploadCloud, X, GripVertical } from "lucide-react";

type LoadedImg = { file: File; id: string; url: string };

export default function ImagesToPdfBase({ accept, kindLabel }: { accept: string; kindLabel: string }) {
  const [images, setImages] = useState<LoadedImg[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (fileList: FileList | File[]) => {
    const arr = Array.from(fileList)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ file: f, id: `${f.name}-${f.size}-${Math.random()}`, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...arr]);
    setResult(null);
  };

  const removeImage = (id: string) => setImages((prev) => prev.filter((i) => i.id !== id));

  const onDragOverItem = (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIndex(i);
  };

  const convert = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const bytes = await img.file.arrayBuffer();
        const isPng = img.file.type === "image/png";
        const embedded = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        const page = pdfDoc.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
      }

      const outBytes = await pdfDoc.save();
      setResult(new Blob([outBytes] as BlobPart[], { type: "application/pdf" }));
    } catch {
      setError(`Não foi possível converter estas imagens ${kindLabel} em PDF.`);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImages([]);
    setResult(null);
    setError(null);
  };

  return (
    <ToolPanel>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-colors duration-150 ${
          dragOver ? "border-action bg-action-soft" : "border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-action-soft mx-auto flex items-center justify-center mb-4">
          <UploadCloud size={22} className="text-action" />
        </div>
        <p className="font-medium text-[15px] mb-1">Arraste suas imagens {kindLabel} aqui</p>
        <p className="text-sm text-muted-light dark:text-muted-dark mb-4">
          ou clique para selecionar (pode escolher várias)
        </p>
        <label className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition bg-action">
          Selecionar imagens
          <input
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-muted-light dark:text-muted-dark mb-2">
            {images.length} imagem{images.length > 1 ? "ns" : ""} · arraste para reordenar as páginas
          </div>
          <div className="rounded-xl border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
            {images.map((img, i) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onDragOverItem(i);
                }}
                onDragEnd={() => setDragIndex(null)}
                className="flex items-center gap-3 px-4 py-2 cursor-move bg-white dark:bg-surface-dark-alt"
              >
                <GripVertical size={15} className="text-muted-light dark:text-muted-dark shrink-0" />
                <span className="text-xs font-mono text-muted-light dark:text-muted-dark w-5 shrink-0">{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-8 h-8 object-cover rounded shrink-0" />
                <span className="text-sm truncate flex-1">{img.file.name}</span>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  aria-label="Remover"
                  className="shrink-0 opacity-60 hover:opacity-100 transition"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={convert}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Gerar PDF ({images.length} página{images.length > 1 ? "s" : ""})
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Gerando PDF..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5">
          <DownloadButton data={result} filename="imagens.pdf" mimeType="application/pdf" label="Baixar PDF" />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
