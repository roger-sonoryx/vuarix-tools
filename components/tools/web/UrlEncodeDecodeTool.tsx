"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";
import { ErrorMessage } from "../shared/Messages";

function compute(mode: "encode" | "decode", value: string) {
  if (!value) return { output: "", error: null as string | null };
  try {
    return {
      output: mode === "encode" ? encodeURIComponent(value) : decodeURIComponent(value),
      error: null,
    };
  } catch {
    return { output: "", error: "Sequência de URL inválida para decodificação." };
  }
}

export default function UrlEncodeDecodeTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const { output, error } = compute(mode, input);

  return (
    <ToolPanel>
      <div className="flex gap-2 mb-4">
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            type="button"
            // Ao trocar de modo, o texto digitado é mantido e recalculado —
            // não é mais apagado.
            onClick={() => setMode(m)}
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

      <label htmlFor="url-input" className="block text-sm font-medium mb-2">
        {mode === "encode" ? "URL ou texto original" : "URL codificada"}
      </label>
      <textarea
        id="url-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
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
        <ResetButton onClick={() => setInput("")} />
      </div>
    </ToolPanel>
  );
}
