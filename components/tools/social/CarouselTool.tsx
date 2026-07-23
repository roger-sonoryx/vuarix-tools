"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import ImageDropzone, { LoadedImage } from "../shared/ImageDropzone";
import { loadImageElement, drawToCanvas, canvasToBlob } from "../shared/canvasUtils";

export default function CarouselTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [slices, setSlices] = useState(3);
  const [results, setResults] = useState<{ blob: Blob; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageElement(image.url);
      // Cada fatia fica quadrada (1080x1080), recortando o pedaço correspondente
      // da largura total — o padrão mais comum de carrossel "puzzle" do Instagram.
      const sliceWidth = img.naturalWidth / slices;
      const sliceHeight = Math.min(sliceWidth, img.naturalHeight);
      const sy = (img.naturalHeight - sliceHeight) / 2;

      const outputs = await Promise.all(
        Array.from({ length: slices }, async (_, i) => {
          const sx = i * sliceWidth;
          const canvas = drawToCanvas(img, 1080, 1080, (ctx, w, h) => {
            ctx.drawImage(img, sx, sy, sliceWidth, sliceHeight, 0, 0, w, h);
          });
          const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
          return { blob, url: URL.createObjectURL(blob) };
        })
      );
      setResults(outputs);
    } catch {
      setError("Não foi possível gerar o carrossel.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setResults([]);
    setError(null);
  };

  return (
    <ToolPanel>
      <ImageDropzone image={image} onLoad={(img) => { setImage(img); setResults([]); }} onClear={clear} />

      {image && (
        <>
          <label htmlFor="carousel-slices" className="flex items-center justify-between text-sm font-medium mb-2 mt-4">
            <span>Número de partes</span>
            <span className="font-mono">{slices}</span>
          </label>
          <input
            id="carousel-slices"
            type="range"
            min={2}
            max={10}
            value={slices}
            onChange={(e) => setSlices(Number(e.target.value))}
            className="w-full accent-action"
          />

          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Gerar carrossel ({slices} imagens)
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Gerando partes do carrossel..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-5">
            {results.map((r, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border-light dark:border-border-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.url} alt={`Parte ${i + 1}`} className="w-full aspect-square object-cover" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {results.map((r, i) => (
              <DownloadButton
                key={i}
                data={r.blob}
                filename={`carrossel-${i + 1}.jpg`}
                mimeType="image/jpeg"
                label={`Parte ${i + 1}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-light dark:text-muted-dark mt-3">
            Poste as imagens nesta mesma ordem (1, 2, 3...) para formar o efeito de painel único no feed.
          </p>
        </>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
