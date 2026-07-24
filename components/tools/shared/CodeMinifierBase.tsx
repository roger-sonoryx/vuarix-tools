"use client";

import { useState } from "react";
import ToolPanel from "./ToolPanel";
import CopyButton from "./CopyButton";
import ResetButton from "./ResetButton";
import DownloadButton from "./DownloadButton";
import { ErrorMessage, SuccessMessage } from "./Messages";

export default function CodeMinifierBase({
  language,
  placeholder,
  minifyFn,
  downloadExt,
  downloadMime,
}: {
  language: string;
  placeholder: string;
  minifyFn: (input: string) => string;
  downloadExt: string;
  downloadMime: string;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const minify = () => {
    if (!input.trim()) return;
    try {
      setOutput(minifyFn(input));
      setError(null);
    } catch {
      setOutput("");
      setError(`Não foi possível minificar este ${language}. Verifique se o código está bem-formado.`);
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const savings =
    output && input ? Math.round((1 - new Blob([output]).size / new Blob([input]).size) * 100) : null;

  return (
    <ToolPanel>
      <label htmlFor="minify-input" className="block text-sm font-medium mb-2">
        Cole seu código {language}
      </label>
      <textarea
        id="minify-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y font-mono"
      />

      <p className="text-xs text-muted-light dark:text-muted-dark mt-2">
        Compressão básica (remove comentários e espaços desnecessários). Para
        JavaScript, não renomeia variáveis nem faz otimizações avançadas como o
        Terser — o objetivo aqui é reduzir tamanho com segurança, sem risco de
        quebrar o código.
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          onClick={minify}
          disabled={!input.trim()}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Minificar {language}
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
          {savings !== null && savings > 0 && (
            <div className="mb-3">
              <SuccessMessage>Reduzido em {savings}%</SuccessMessage>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-sm font-medium">Resultado</span>
            <div className="flex gap-2">
              <CopyButton value={output} />
              <DownloadButton
                data={output}
                filename={`minificado.${downloadExt}`}
                mimeType={downloadMime}
                label={`Baixar .${downloadExt}`}
              />
            </div>
          </div>
          <pre className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-xs font-mono overflow-x-auto max-h-60 whitespace-pre-wrap break-all">
            {output}
          </pre>
        </div>
      )}
    </ToolPanel>
  );
}
