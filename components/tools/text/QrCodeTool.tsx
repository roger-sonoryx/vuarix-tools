"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import DownloadButton from "../shared/DownloadButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";

export default function QrCodeTool() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [darkColor, setDarkColor] = useState("#0E1520");
  const [lightColor, setLightColor] = useState("#FFFFFF");
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
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin,
        color: { dark: darkColor, light: lightColor },
      });
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

  const clear = () => {
    setText("");
    setDataUrl(null);
    setBlob(null);
    setError(null);
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div>
          <label htmlFor="qr-size" className="block text-xs text-muted-light dark:text-muted-dark mb-1">
            Tamanho ({size}px)
          </label>
          <input
            id="qr-size"
            type="range"
            min={128}
            max={640}
            step={32}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-action"
          />
        </div>
        <div>
          <label htmlFor="qr-margin" className="block text-xs text-muted-light dark:text-muted-dark mb-1">
            Margem ({margin})
          </label>
          <input
            id="qr-margin"
            type="range"
            min={0}
            max={6}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="w-full accent-action"
          />
        </div>
        <div>
          <label htmlFor="qr-dark" className="block text-xs text-muted-light dark:text-muted-dark mb-1">
            Cor principal
          </label>
          <input
            id="qr-dark"
            type="color"
            value={darkColor}
            onChange={(e) => setDarkColor(e.target.value)}
            className="w-full h-9 rounded-lg border border-border-light dark:border-border-dark cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="qr-light" className="block text-xs text-muted-light dark:text-muted-dark mb-1">
            Cor de fundo
          </label>
          <input
            id="qr-light"
            type="color"
            value={lightColor}
            onChange={(e) => setLightColor(e.target.value)}
            className="w-full h-9 rounded-lg border border-border-light dark:border-border-dark cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          type="button"
          onClick={generate}
          disabled={!text.trim() || loading}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Gerar QR Code
        </button>
        <ResetButton onClick={clear} />
      </div>

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
