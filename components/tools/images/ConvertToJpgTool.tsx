"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import { UploadCloud, X, FileImage } from "lucide-react";
import { canvasToBlob } from "../shared/canvasUtils";

type SourceFormat = "avif" | "webp" | "heic" | "other";

function detectFormat(file: File): SourceFormat {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  if (type.includes("avif") || name.endsWith(".avif")) return "avif";
  if (type.includes("webp") || name.endsWith(".webp")) return "webp";
  if (type.includes("heic") || type.includes("heif") || name.endsWith(".heic") || name.endsWith(".heif")) return "heic";
  return "other";
}

export default function ConvertToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<SourceFormat>("other");
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setFormat(detectFormat(f));
    setResult(null);
    setError(null);
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      if (format === "heic") {
        const heic2any = (await import("heic2any")).default;
        const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        setResult({ blob, url: URL.createObjectURL(blob) });
      } else {
        const url = URL.createObjectURL(file);
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(
              new Error(
                "Este navegador não conseguiu abrir o arquivo. Formatos AVIF/WebP muito recentes podem não ser suportados em navegadores mais antigos."
              )
            );
          img.src = url;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas não suportado.");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
        setResult({ blob, url: URL.createObjectURL(blob) });
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível converter esta imagem para JPG.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setFormat("other");
    setResult(null);
    setError(null);
  };

  return (
    <ToolPanel>
      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-colors duration-150 ${
            dragOver ? "border-action bg-action-soft" : "border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-action-soft mx-auto flex items-center justify-center mb-4">
            <UploadCloud size={22} className="text-action" />
          </div>
          <p className="font-medium text-[15px] mb-1">Arraste sua imagem aqui</p>
          <p className="text-sm text-muted-light dark:text-muted-dark mb-4">AVIF, HEIC/HEIF ou WebP</p>
          <label className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition bg-action">
            Selecionar imagem
            <input
              type="file"
              accept=".avif,.webp,.heic,.heif,image/avif,image/webp,image/heic,image/heif"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </div>
      )}

      {file && (
        <div className="rounded-xl border border-border-light dark:border-border-dark p-4 flex items-center gap-3">
          <FileImage size={18} className="text-action shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{file.name}</div>
            <div className="text-xs text-muted-light dark:text-muted-dark">
              {format === "other" ? "Formato não identificado — tentaremos abrir mesmo assim" : format.toUpperCase()} · {(file.size / 1024).toFixed(0)} KB
            </div>
          </div>
          <button type="button" onClick={clear} aria-label="Remover" className="shrink-0 opacity-60 hover:opacity-100 transition">
            <X size={16} />
          </button>
        </div>
      )}

      {file && (
        <button
          type="button"
          onClick={convert}
          disabled={loading}
          className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Converter para JPG
        </button>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label={format === "heic" ? "Convertendo HEIC (pode levar alguns segundos)..." : "Convertendo..."} />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5 flex flex-col items-center gap-4">
          <img src={result.url} alt="Resultado convertido" className="max-h-72 rounded-xl border border-border-light dark:border-border-dark" />
          <DownloadButton data={result.blob} filename="convertida.jpg" mimeType="image/jpeg" label="Baixar JPG" />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
