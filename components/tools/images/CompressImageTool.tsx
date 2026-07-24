"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage, SuccessMessage } from "../shared/Messages";
import ImageDropzone, { LoadedImage } from "../shared/ImageDropzone";
import { loadImageElement, drawToCanvas, canvasToBlob, EXT } from "../shared/canvasUtils";

export default function CompressImageTool() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [quality, setQuality] = useState(0.75);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const outputType = image?.file.type === "image/png" ? "image/png" : "image/jpeg";

  const compress = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageElement(image.url);
      const canvas = drawToCanvas(img, image.width, image.height);
      const blob = await canvasToBlob(canvas, outputType, outputType === "image/jpeg" ? quality : undefined);

      if (blob.size >= image.file.size) {
        setResult(null);
        setError("A imagem já está otimizada ou não ficou menor após a compressão.");
      } else {
        setResult({ blob, url: URL.createObjectURL(blob) });
      }
    } catch {
      setError("Não foi possível comprimir esta imagem.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const savings =
    result && image ? Math.round((1 - result.blob.size / image.file.size) * 100) : null;

  return (
    <ToolPanel>
      <ImageDropzone image={image} onLoad={(img) => { setImage(img); setResult(null); }} onClear={clear} />

      {image && outputType === "image/jpeg" && (
        <div className="mt-4">
          <label htmlFor="quality" className="flex items-center justify-between text-sm font-medium mb-2">
            <span>Qualidade</span>
            <span className="font-mono">{Math.round(quality * 100)}%</span>
          </label>
          <input
            id="quality"
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-action"
          />
        </div>
      )}

      {image && outputType === "image/png" && (
        <p className="text-xs text-muted-light dark:text-muted-dark mt-3">
          PNG é compactado sem perdas — a otimização é automática, sem controle de qualidade.
        </p>
      )}

      {image && (
        <button
          type="button"
          onClick={compress}
          disabled={loading}
          className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Comprimir imagem
        </button>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Comprimindo..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {result && image && (
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            {savings !== null && savings > 0 && (
              <SuccessMessage>
                Reduzido em {savings}% ({(result.blob.size / 1024).toFixed(0)} KB, era {(image.file.size / 1024).toFixed(0)} KB)
              </SuccessMessage>
            )}
          </div>
          <DownloadButton
            data={result.blob}
            filename={`comprimida.${EXT[outputType]}`}
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
