"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import ImageDropzone, { LoadedImage } from "../shared/ImageDropzone";
import { loadImageElement, coverCropCanvas, canvasToBlob } from "../shared/canvasUtils";

const W = 1080;
const H = 1920;

export default function StoriesTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [mode, setMode] = useState<"crop" | "blur-fill">("crop");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (m = mode) => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageElement(image.url);

      if (m === "crop") {
        const canvas = coverCropCanvas(img, W, H);
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
        setResult({ blob, url: URL.createObjectURL(blob) });
        return;
      }

      // blur-fill: fundo desfocado (cover) + imagem original inteira centralizada (contain)
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas não suportado.");

      const bgCanvas = coverCropCanvas(img, W, H);
      ctx.filter = "blur(24px) brightness(0.7)";
      ctx.drawImage(bgCanvas, 0, 0);
      ctx.filter = "none";

      const ratio = Math.min(W / img.naturalWidth, H / img.naturalHeight);
      const drawW = img.naturalWidth * ratio;
      const drawH = img.naturalHeight * ratio;
      ctx.drawImage(img, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);

      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch {
      setError("Não foi possível gerar o Story.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <ToolPanel>
      <ImageDropzone image={image} onLoad={(img) => { setImage(img); setResult(null); }} onClear={clear} />

      {image && (
        <>
          <label className="block text-sm font-medium mb-2 mt-4">Como preencher o formato 1080×1920</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setMode("crop"); generate("crop"); }}
              className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
                mode === "crop" ? "bg-action text-white border-action" : "border-border-light dark:border-border-dark hover:opacity-70"
              }`}
            >
              Cortar para preencher
            </button>
            <button
              type="button"
              onClick={() => { setMode("blur-fill"); generate("blur-fill"); }}
              className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
                mode === "blur-fill" ? "bg-action text-white border-action" : "border-border-light dark:border-border-dark hover:opacity-70"
              }`}
            >
              Manter imagem inteira (fundo desfocado)
            </button>
          </div>

          <button
            type="button"
            onClick={() => generate()}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Gerar Story
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Gerando Story..." />
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
          <img src={result.url} alt="Story gerado" className="max-h-96 rounded-xl border border-border-light dark:border-border-dark" />
          <DownloadButton data={result.blob} filename="story-1080x1920.jpg" mimeType="image/jpeg" label="Baixar Story" />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
