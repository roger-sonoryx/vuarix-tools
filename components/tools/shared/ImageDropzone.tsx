"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

export type LoadedImage = {
  file: File;
  url: string;
  width: number;
  height: number;
};

export default function ImageDropzone({
  image,
  onLoad,
  onClear,
  accept = "image/jpeg,image/png,image/webp",
}: {
  image: LoadedImage | null;
  onLoad: (img: LoadedImage) => void;
  onClear: () => void;
  accept?: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      onLoad({ file, url, width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  if (image) {
    return (
      <div className="relative rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt="Pré-visualização" className="w-full max-h-80 object-contain bg-surface-light dark:bg-surface-dark" />
        <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-light dark:text-muted-dark border-t border-border-light dark:border-border-dark">
          <span>
            {image.file.name} · {image.width}×{image.height}px · {(image.file.size / 1024).toFixed(0)} KB
          </span>
          <button
            type="button"
            onClick={onClear}
            aria-label="Remover imagem"
            className="flex items-center gap-1 hover:opacity-70 transition"
          >
            <X size={14} />
            Remover
          </button>
        </div>
      </div>
    );
  }

  return (
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
      style={dragOver ? { borderColor: "var(--tw-action, #2F6FED)" } : undefined}
      className={`rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-colors duration-150 ${
        dragOver ? "border-action bg-action-soft" : "border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-action-soft mx-auto flex items-center justify-center mb-4">
        <UploadCloud size={22} className="text-action" />
      </div>
      <p className="font-medium text-[15px] mb-1">Arraste sua imagem aqui</p>
      <p className="text-sm text-muted-light dark:text-muted-dark mb-4">ou clique para selecionar (JPG, PNG ou WebP)</p>
      <label className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition bg-action">
        Selecionar imagem
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>
    </div>
  );
}
