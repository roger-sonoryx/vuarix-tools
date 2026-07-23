"use client";

import { useRef, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";
import { ErrorMessage } from "../shared/Messages";

export default function Md5Tool() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Evita que um cálculo antigo sobrescreva um resultado mais recente.
  const requestId = useRef(0);

  const generate = async () => {
    if (!input) return;
    const currentId = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      // Import dinâmico: crypto-js só entra no bundle quando esta ferramenta é aberta.
      const mod = await import("crypto-js");
      const CryptoJS = mod.default;
      const result = CryptoJS.MD5(input).toString();
      if (currentId === requestId.current) setHash(result);
    } catch {
      if (currentId === requestId.current) {
        setError("Não foi possível carregar o gerador de hash. Tente novamente.");
      }
    } finally {
      if (currentId === requestId.current) setLoading(false);
    }
  };

  return (
    <ToolPanel>
      <label htmlFor="md5-input" className="block text-sm font-medium mb-2">
        Texto a ser convertido em hash
      </label>
      <textarea
        id="md5-input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setHash("");
          setError(null);
        }}
        rows={4}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y"
      />

      <p className="text-xs text-muted-light dark:text-muted-dark mt-2">
        MD5 não é seguro para armazenar senhas. Use apenas para checagem de integridade ou compatibilidade com sistemas legados.
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          onClick={generate}
          disabled={!input || loading}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Gerar hash MD5
        </button>
        <ResetButton
          onClick={() => {
            setInput("");
            setHash("");
            setError(null);
            requestId.current += 1;
          }}
        />
      </div>

      {loading && (
        <div className="mt-3">
          <LoadingState label="Calculando hash..." />
        </div>
      )}

      {error && (
        <div className="mt-3">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {!loading && hash && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">MD5</span>
            <CopyButton value={hash} />
          </div>
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm font-mono break-all select-all">
            {hash}
          </div>
        </div>
      )}
    </ToolPanel>
  );
}
