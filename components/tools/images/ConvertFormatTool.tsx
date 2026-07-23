"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";
import ImageDropzone, { LoadedImage } from "../shared/ImageDropzone";
import { loadImageElement, drawToCanvas, canvasToBlob, EXT, MIME_LABELS } from "../shared/canvasUtils";

const FORMATS = ["image/jpeg", "image/png", "image/webp"] as const;

export default function ConvertFormatTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [target, setTarget] = useState<(typeof FORMATS)[number]>("image/webp");
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convert = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageElement(image.url);
      const canvas = drawToCanvas(img, image.width, image.height, (ctx, w, h) => {
        // Fundo branco para formatos sem transparência (ex: JPG a partir de PNG).
        if (target === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(img, 0, 0, w, h);
      });
      const blob = await canvasToBlob(canvas, target, target !== "image/png" ? 0.92 : undefined);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch {
      setError("Este navegador não conseguiu converter para o formato selecionado.");
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
          <label htmlFor="format-target" className="block text-sm font-medium mb-2 mt-4">
            Converter para
          </label>
          <div className="flex gap-2">
            {FORMATS.filter((f) => f !== image.file.type).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTarget(f)}
                className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
                  target === f
                    ? "bg-action text-white border-action"
                    : "border-border-light dark:border-border-dark hover:opacity-70"
                }`}
              >
                {MIME_LABELS[f]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={convert}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Converter
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Convertendo..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && (
        <div className="mt-5">
          <DownloadButton
            data={result.blob}
            filename={`convertida.${EXT[target]}`}
            mimeType={target}
            label={`Baixar ${MIME_LABELS[target]}`}
          />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
