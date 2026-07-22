"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";
import { ErrorMessage } from "../shared/Messages";

// btoa/atob puros quebram com acentos (UTF-8). Estas funções tratam corretamente.
function encodeUtf8Base64(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function decodeUtf8Base64(input: string) {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const output = (() => {
    if (!input) return "";
    try {
      setError(null);
      return mode === "encode" ? encodeUtf8Base64(input) : decodeUtf8Base64(input);
    } catch {
      return "";
    }
  })();

  const handleChange = (value: string) => {
    setInput(value);
    if (!value) {
      setError(null);
      return;
    }
    try {
      mode === "encode" ? encodeUtf8Base64(value) : decodeUtf8Base64(value);
      setError(null);
    } catch {
      setError("Texto inválido para decodificação Base64.");
    }
  };

  return (
    <ToolPanel>
      <div className="flex gap-2 mb-4">
        {(["encode", "decode"] as const).map((m) => (
          <button type="button"
            key={m}
            onClick={() => {
              setMode(m);
              setInput("");
              setError(null);
            }}
            className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
              mode === m
                ? "bg-action text-white border-action"
                : "border-border-light dark:border-border-dark hover:opacity-70"
            }`}
          >
            {m === "encode" ? "Codificar" : "Decodificar"}
          </button>
        ))}
      </div>

      <label htmlFor="base64-input" className="block text-sm font-medium mb-2">
        {mode === "encode" ? "Texto original" : "Texto em Base64"}
      </label>
      <textarea
        id="base64-input"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        rows={5}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y font-mono"
      />

      {error && (
        <div className="mt-3">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {!error && output && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Resultado</div>
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm font-mono break-all select-all">
            {output}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-5">
        <CopyButton value={output} />
        <ResetButton
          onClick={() => {
            setInput("");
            setError(null);
          }}
        />
      </div>
    </ToolPanel>
  );
}
