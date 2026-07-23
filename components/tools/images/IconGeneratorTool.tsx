"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import ImageDropzone, { LoadedImage } from "../shared/ImageDropzone";
import { loadImageElement, drawToCanvas, canvasToBlob } from "../shared/canvasUtils";

const SIZES = [16, 32, 48, 64, 128, 192, 256, 512];

export default function IconGeneratorTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [icons, setIcons] = useState<{ size: number; blob: Blob; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageElement(image.url);
      const results = await Promise.all(
        SIZES.map(async (size) => {
          // Recorte central quadrado antes de redimensionar, para não distorcer.
          const minSide = Math.min(image.width, image.height);
          const sx = (image.width - minSide) / 2;
          const sy = (image.height - minSide) / 2;
          const canvas = drawToCanvas(img, size, size, (ctx, w, h) => {
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, w, h);
          });
          const blob = await canvasToBlob(canvas, "image/png");
          return { size, blob, url: URL.createObjectURL(blob) };
        })
      );
      setIcons(results);
    } catch {
      setError("Não foi possível gerar os ícones.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setIcons([]);
    setError(null);
  };

  return (
    <ToolPanel>
      <ImageDropzone image={image} onLoad={(img) => { setImage(img); setIcons([]); }} onClear={clear} />

      {image && (
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Gerar ícones ({SIZES.length} tamanhos)
        </button>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Gerando ícones..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {icons.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {icons.map((icon) => (
            <div
              key={icon.size}
              className="rounded-xl border border-border-light dark:border-border-dark p-3 flex flex-col items-center gap-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon.url} alt={`Ícone ${icon.size}x${icon.size}`} className="w-12 h-12 object-contain" />
              <span className="text-xs font-mono">{icon.size}×{icon.size}</span>
              <DownloadButton
                data={icon.blob}
                filename={`icon-${icon.size}x${icon.size}.png`}
                mimeType="image/png"
                label="Baixar"
              />
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
