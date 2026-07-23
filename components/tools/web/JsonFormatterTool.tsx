"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";
import DownloadButton from "../shared/DownloadButton";
import { ErrorMessage } from "../shared/Messages";

export default function JsonFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const format = (indent: number) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? `JSON inválido: ${e.message}` : "JSON inválido.");
    }
  };

  return (
    <ToolPanel>
      <label htmlFor="json-input" className="block text-sm font-medium mb-2">
        Cole seu JSON
      </label>
      <textarea
        id="json-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        placeholder='{"exemplo": true}'
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y font-mono"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          type="button"
          onClick={() => format(2)}
          disabled={!input}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Formatar (2 espaços)
        </button>
        <button
          type="button"
          onClick={() => format(4)}
          disabled={!input}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Formatar (4 espaços)
        </button>
        <button
          type="button"
          onClick={() => format(0)}
          disabled={!input}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Minificar
        </button>
        <ResetButton
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
        />
      </div>

      {error && (
        <div className="mt-4">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {!error && output && (
        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-sm font-medium">Resultado</span>
            <div className="flex gap-2">
              <CopyButton value={output} />
              <DownloadButton data={output} filename="dados.json" mimeType="application/json" label="Baixar .json" />
            </div>
          </div>
          <pre className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-xs font-mono overflow-x-auto max-h-80">
            {output}
          </pre>
        </div>
      )}
    </ToolPanel>
  );
}
