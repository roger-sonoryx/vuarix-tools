"use client";

import { useRef, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import ImageDropzone, { LoadedImage } from "../shared/ImageDropzone";
import { loadImageElement, drawToCanvas, canvasToBlob, EXT } from "../shared/canvasUtils";

type Rect = { x: number; y: number; w: number; h: number };

export default function CropImageTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = (img: LoadedImage) => {
    setImage(img);
    setRect(null);
    setResult(null);
  };

  const getRelativePoint = (e: React.MouseEvent) => {
    const el = imgRef.current;
    if (!el) return { x: 0, y: 0 };
    const bounds = el.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - bounds.left, 0), bounds.width);
    const y = Math.min(Math.max(e.clientY - bounds.top, 0), bounds.height);
    return { x, y };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const p = getRelativePoint(e);
    setDragStart(p);
    setRect({ x: p.x, y: p.y, w: 0, h: 0 });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;
    const p = getRelativePoint(e);
    setRect({
      x: Math.min(dragStart.x, p.x),
      y: Math.min(dragStart.y, p.y),
      w: Math.abs(p.x - dragStart.x),
      h: Math.abs(p.y - dragStart.y),
    });
  };

  const onMouseUp = () => setDragStart(null);

  const crop = async () => {
    if (!image || !rect || rect.w < 4 || rect.h < 4 || !imgRef.current) {
      setError("Arraste sobre a imagem para selecionar a área a recortar.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const displayed = imgRef.current.getBoundingClientRect();
      const scaleX = image.width / displayed.width;
      const scaleY = image.height / displayed.height;

      const sx = rect.x * scaleX;
      const sy = rect.y * scaleY;
      const sw = rect.w * scaleX;
      const sh = rect.h * scaleY;

      const fullImg = await loadImageElement(image.url);
      const canvas = drawToCanvas(fullImg, Math.round(sw), Math.round(sh), (ctx, w, h) => {
        ctx.drawImage(fullImg, sx, sy, sw, sh, 0, 0, w, h);
      });
      const type = image.file.type || "image/png";
      const blob = await canvasToBlob(canvas, type, type === "image/jpeg" ? 0.92 : undefined);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch {
      setError("Não foi possível recortar esta imagem.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setRect(null);
    setResult(null);
    setError(null);
  };

  const outputType = image?.file.type || "image/png";

  return (
    <ToolPanel>
      {!image && <ImageDropzone image={null} onLoad={handleLoad} onClear={clear} />}

      {image && (
        <>
          <p className="text-sm text-muted-light dark:text-muted-dark mb-2">
            Clique e arraste sobre a imagem para selecionar a área a recortar.
          </p>
          <div
            className="relative select-none rounded-2xl border border-border-light dark:border-border-dark overflow-hidden bg-surface-light dark:bg-surface-dark cursor-crosshair"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={image.url} alt="Selecione a área" className="w-full max-h-96 object-contain pointer-events-none" draggable={false} />
            {rect && (
              <div
                className="absolute border-2 border-action bg-action/20"
                style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={crop}
              disabled={loading}
              className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cortar imagem
            </button>
            <ResetButton onClick={clear} label="Limpar tudo" />
          </div>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Recortando..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5 flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.url} alt="Resultado recortado" className="max-h-64 rounded-xl border border-border-light dark:border-border-dark" />
          <DownloadButton
            data={result.blob}
            filename={`recortada.${EXT[outputType] ?? "png"}`}
            mimeType={outputType}
            label="Baixar"
          />
        </div>
      )}
    </ToolPanel>
  );
}
