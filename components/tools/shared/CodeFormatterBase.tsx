"use client";

import { useState } from "react";
import ToolPanel from "./ToolPanel";
import CopyButton from "./CopyButton";
import ResetButton from "./ResetButton";
import DownloadButton from "./DownloadButton";
import { ErrorMessage } from "./Messages";

export default function CodeFormatterBase({
  language,
  placeholder,
  formatFn,
  downloadExt,
  downloadMime,
}: {
  language: string;
  placeholder: string;
  formatFn: (input: string, indentSize: number) => string;
  downloadExt: string;
  downloadMime: string;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const format = (size = indentSize) => {
    if (!input.trim()) return;
    try {
      setOutput(formatFn(input, size));
      setError(null);
    } catch {
      setOutput("");
      setError(`Não foi possível formatar este ${language}. Verifique se o código está bem-formado.`);
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <ToolPanel>
      <label htmlFor="format-input" className="block text-sm font-medium mb-2">
        Cole seu código {language}
      </label>
      <textarea
        id="format-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y font-mono"
      />

      <div className="flex flex-wrap items-center gap-3 mt-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-light dark:text-muted-dark">Indentação:</span>
          {[2, 4].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setIndentSize(size);
                format(size);
              }}
              className={`px-2.5 py-1 rounded-md border text-xs font-medium transition ${
                indentSize === size
                  ? "bg-action text-white border-action"
                  : "border-border-light dark:border-border-dark hover:opacity-70"
              }`}
            >
              {size} espaços
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          onClick={() => format()}
          disabled={!input.trim()}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Formatar {language}
        </button>
        <ResetButton onClick={clear} />
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
              <DownloadButton
                data={output}
                filename={`formatado.${downloadExt}`}
                mimeType={downloadMime}
                label={`Baixar .${downloadExt}`}
              />
            </div>
          </div>
          <pre className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-xs font-mono overflow-x-auto max-h-96 whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </ToolPanel>
  );
}
