"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import ImageDropzone, { LoadedImage } from "../shared/ImageDropzone";
import { loadImageElement, drawToCanvas, canvasToBlob, EXT } from "../shared/canvasUtils";

export default function ResizeImageTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepRatio, setKeepRatio] = useState(true);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = (img: LoadedImage) => {
    setImage(img);
    setWidth(String(img.width));
    setHeight(String(img.height));
    setResult(null);
  };

  const updateWidth = (v: string) => {
    setWidth(v);
    if (keepRatio && image) {
      const w = parseInt(v, 10);
      if (w > 0) setHeight(String(Math.round((w / image.width) * image.height)));
    }
  };

  const updateHeight = (v: string) => {
    setHeight(v);
    if (keepRatio && image) {
      const h = parseInt(v, 10);
      if (h > 0) setWidth(String(Math.round((h / image.height) * image.width)));
    }
  };

  const resize = async () => {
    if (!image) return;
    const w = parseInt(width, 10);
    const h = parseInt(height, 10);
    if (!w || !h || w <= 0 || h <= 0) {
      setError("Informe largura e altura válidas.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageElement(image.url);
      const canvas = drawToCanvas(img, w, h);
      const type = image.file.type || "image/png";
      const blob = await canvasToBlob(canvas, type, type === "image/jpeg" ? 0.92 : undefined);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch {
      setError("Não foi possível redimensionar esta imagem.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setWidth("");
    setHeight("");
    setResult(null);
    setError(null);
  };

  const outputType = image?.file.type || "image/png";

  return (
    <ToolPanel>
      <ImageDropzone image={image} onLoad={handleLoad} onClear={clear} />

      {image && (
        <>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="resize-w" className="block text-sm font-medium mb-1.5">
                Largura (px)
              </label>
              <input
                id="resize-w"
                type="number"
                value={width}
                onChange={(e) => updateWidth(e.target.value)}
                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
              />
            </div>
            <div>
              <label htmlFor="resize-h" className="block text-sm font-medium mb-1.5">
                Altura (px)
              </label>
              <input
                id="resize-h"
                type="number"
                value={height}
                onChange={(e) => updateHeight(e.target.value)}
                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 mt-3 text-sm">
            <input
              type="checkbox"
              checked={keepRatio}
              onChange={(e) => setKeepRatio(e.target.checked)}
              className="accent-action"
            />
            Manter proporção
          </label>

          <button
            type="button"
            onClick={resize}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Redimensionar
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Redimensionando..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5 flex items-center gap-4">
          <DownloadButton
            data={result.blob}
            filename={`redimensionada.${EXT[outputType] ?? "png"}`}
            mimeType={outputType}
            label="Baixar"
          />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
