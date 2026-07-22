"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";

export default function QrCodeTool() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Import dinâmico: a lib "qrcode" só entra no bundle quando a ferramenta é aberta.
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(text, { width: 320, margin: 2 });
      setDataUrl(url);
      const fetched = await fetch(url);
      setBlob(await fetched.blob());
    } catch {
      setError("Não foi possível gerar o QR Code. Tente novamente.");
      setDataUrl(null);
      setBlob(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPanel>
      <label htmlFor="qr-input" className="block text-sm font-medium mb-2">
        Texto, link ou informação
      </label>
      <input
        id="qr-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="https://vuarix.com"
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 text-sm outline-none focus:border-action transition"
      />

      <button type="button"
        onClick={generate}
        disabled={!text.trim() || loading}
        className="mt-4 text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Gerar QR Code
      </button>

      {loading && (
        <div className="mt-4">
          <LoadingState label="Gerando QR Code..." />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {!loading && dataUrl && (
        <div className="mt-5 flex flex-col items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt={`QR Code para: ${text}`} className="rounded-xl border border-border-light dark:border-border-dark" />
          <DownloadButton data={blob} filename="vuarix-qrcode.png" mimeType="image/png" label="Baixar PNG" />
        </div>
      )}
    </ToolPanel>
  );
}
