"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";

// Extrai o ID do vídeo de qualquer formato comum de URL do YouTube.
function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // o próprio ID, colado direto
  ];
  for (const p of patterns) {
    const match = trimmed.match(p);
    if (match) return match[1];
  }
  return null;
}

// Resoluções públicas servidas pelo próprio YouTube — não requer chave de API.
const QUALITIES = [
  { id: "maxresdefault", label: "Máxima (1280×720, se disponível)" },
  { id: "sddefault", label: "Alta (640×480)" },
  { id: "hqdefault", label: "Padrão (480×360)" },
  { id: "mqdefault", label: "Média (320×180)" },
];

export default function YoutubeThumbnailTool() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [blobs, setBlobs] = useState<Record<string, Blob>>({});
  const [fallbackIds, setFallbackIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    const id = extractVideoId(url);
    if (!id) {
      setError("Não encontrei um ID de vídeo válido nesse link. Cole a URL completa do YouTube.");
      return;
    }
    setVideoId(id);
    setLoading(true);
    setError(null);
    setBlobs({});
    setFallbackIds([]);
    try {
      const entries = await Promise.all(
        QUALITIES.map(async (q) => {
          const imgUrl = `https://i.ytimg.com/vi/${id}/${q.id}.jpg`;
          try {
            const res = await fetch(imgUrl);
            if (!res.ok) return null;
            const blob = await res.blob();
            // O YouTube retorna uma imagem de 120x90 genérica quando a
            // resolução pedida não existe para aquele vídeo — filtramos isso.
            if (blob.size < 1000) return null;
            return { id: q.id, blob } as const;
          } catch {
            // CORS ou rede bloqueada: cai no fallback de exibição direta.
            return { id: q.id, blob: null } as const;
          }
        })
      );

      const found: Record<string, Blob> = {};
      const fallback: string[] = [];
      for (const entry of entries) {
        if (!entry) continue;
        if (entry.blob) found[entry.id] = entry.blob;
        else fallback.push(entry.id);
      }

      if (Object.keys(found).length === 0 && fallback.length === 0) {
        setError("Não foi possível carregar miniaturas para este vídeo. Verifique se o link está correto.");
      }
      setBlobs(found);
      setFallbackIds(fallback);
    } catch {
      setError("Não foi possível buscar a miniatura. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setUrl("");
    setVideoId(null);
    setBlobs({});
    setFallbackIds([]);
    setError(null);
  };

  return (
    <ToolPanel>
      <label htmlFor="yt-url" className="block text-sm font-medium mb-2">
        Link do vídeo do YouTube
      </label>
      <div className="flex gap-2">
        <input
          id="yt-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
        />
        <button
          type="button"
          onClick={search}
          disabled={!url.trim() || loading}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          Buscar
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <LoadingState label="Buscando miniaturas..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {videoId && (Object.keys(blobs).length > 0 || fallbackIds.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {QUALITIES.filter((q) => blobs[q.id]).map((q) => (
            <div key={q.id} className="rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(blobs[q.id])}
                alt={q.label}
                className="w-full aspect-video object-cover"
              />
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs text-muted-light dark:text-muted-dark">{q.label}</span>
                <DownloadButton
                  data={blobs[q.id]}
                  filename={`thumbnail-${videoId}-${q.id}.jpg`}
                  mimeType="image/jpeg"
                  label="Baixar"
                />
              </div>
            </div>
          ))}
          {QUALITIES.filter((q) => fallbackIds.includes(q.id)).map((q) => {
            const directUrl = `https://i.ytimg.com/vi/${videoId}/${q.id}.jpg`;
            return (
              <div key={q.id} className="rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={directUrl} alt={q.label} className="w-full aspect-video object-cover" />
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-muted-light dark:text-muted-dark">{q.label}</span>
                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition"
                  >
                    Abrir imagem
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {fallbackIds.length > 0 && (
        <p className="text-xs text-muted-light dark:text-muted-dark mt-3">
          Algumas miniaturas não puderam ser baixadas diretamente pelo navegador. Clique em
          &quot;Abrir imagem&quot; e use botão direito → Salvar imagem como.
        </p>
      )}

      <div className="mt-4">
        <ResetButton onClick={clear} />
      </div>
    </ToolPanel>
  );
}
