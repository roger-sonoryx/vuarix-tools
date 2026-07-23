"use client";

import { useState } from "react";
import ToolPanel from "./ToolPanel";
import DownloadButton from "./DownloadButton";
import ResetButton from "./ResetButton";
import LoadingState from "./LoadingState";
import { ErrorMessage } from "./Messages";
import ImageDropzone, { LoadedImage } from "./ImageDropzone";
import { loadImageElement, coverCropCanvas, canvasToBlob } from "./canvasUtils";
import type { SocialPreset } from "./socialPresets";

export default function SocialResizeBase({ presets }: { presets: SocialPreset[] }) {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [preset, setPreset] = useState<SocialPreset>(presets[0]);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (p = preset) => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const img = await loadImageElement(image.url);
      const canvas = coverCropCanvas(img, p.width, p.height);
      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch {
      setError("Não foi possível gerar esta imagem.");
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
      <ImageDropzone
        image={image}
        onLoad={(img) => {
          setImage(img);
          setResult(null);
        }}
        onClear={clear}
      />

      {image && (
        <>
          <label className="block text-sm font-medium mb-2 mt-4">Formato</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPreset(p);
                  generate(p);
                }}
                className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
                  preset.id === p.id
                    ? "bg-action text-white border-action"
                    : "border-border-light dark:border-border-dark hover:opacity-70"
                }`}
              >
                {p.label}{" "}
                <span className="text-xs opacity-70">
                  ({p.width}×{p.height})
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => generate()}
            disabled={loading}
            className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Gerar imagem
          </button>
        </>
      )}

      {loading && (
        <div className="mt-4">
          <LoadingState label="Gerando imagem..." />
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
          <img
            src={result.url}
            alt={`Pré-visualização ${preset.label}`}
            className="max-h-72 rounded-xl border border-border-light dark:border-border-dark"
          />
          <DownloadButton
            data={result.blob}
            filename={`${preset.id}-${preset.width}x${preset.height}.jpg`}
            mimeType="image/jpeg"
            label="Baixar imagem"
          />
        </div>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} label="Limpar tudo" />
      </div>
    </ToolPanel>
  );
}
