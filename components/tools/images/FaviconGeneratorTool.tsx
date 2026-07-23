"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import ImageDropzone, { LoadedImage } from "../shared/ImageDropzone";
import { loadImageElement, drawToCanvas, canvasToBlob } from "../shared/canvasUtils";

// Tamanhos padrão de favicon usados por navegadores e dispositivos Apple/Android.
const SIZES = [
  { size: 16, label: "favicon-16x16.png" },
  { size: 32, label: "favicon-32x32.png" },
  { size: 48, label: "favicon-48x48.png" },
  { size: 180, label: "apple-touch-icon.png" },
  { size: 192, label: "android-chrome-192x192.png" },
  { size: 512, label: "android-chrome-512x512.png" },
];

export default function FaviconGeneratorTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [favicons, setFavicons] = useState<{ label: string; size: number; blob: Blob; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageElement(image.url);
      const minSide = Math.min(image.width, image.height);
      const sx = (image.width - minSide) / 2;
      const sy = (image.height - minSide) / 2;

      const results = await Promise.all(
        SIZES.map(async ({ size, label }) => {
          const canvas = drawToCanvas(img, size, size, (ctx, w, h) => {
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, w, h);
          });
          const blob = await canvasToBlob(canvas, "image/png");
          return { label, size, blob, url: URL.createObjectURL(blob) };
        })
      );
      setFavicons(results);
    } catch {
      setError("Não foi possível gerar os favicons.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setFavicons([]);
    setError(null);
  };

  return (
    <ToolPanel>
      <ImageDropzone image={image} onLoad={(img) => { setImage(img); setFavicons([]); }} onClear={clear} />

      {image && (
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Gerar pacote de favicons
        </button>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Gerando favicons..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {favicons.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            {favicons.map((f) => (
              <div
                key={f.label}
                className="rounded-xl border border-border-light dark:border-border-dark p-3 flex flex-col items-center gap-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.label} className="w-10 h-10 object-contain" />
                <span className="text-xs font-mono text-center">{f.label}</span>
                <DownloadButton data={f.blob} filename={f.label} mimeType="image/png" label="Baixar" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-light dark:text-muted-dark mt-4">
            Baixe cada arquivo e coloque-os na raiz do seu site, referenciando-os no
            <code className="mx-1 px-1 py-0.5 rounded bg-surface-light dark:bg-surface-dark font-mono">{"<head>"}</code>
            do HTML.
          </p>
        </>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
