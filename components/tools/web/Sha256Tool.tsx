"use client";

import { useRef, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";

// SHA-256 via Web Crypto API nativa do navegador — sem biblioteca externa.
async function sha256(text: string) {
  const bytes = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function Sha256Tool() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  // Token de requisição: garante que só a última digitação atualize o resultado,
  // mesmo se um cálculo anterior terminar depois de um mais recente.
  const requestId = useRef(0);

  const handleChange = async (value: string) => {
    setInput(value);
    if (!value) {
      setHash("");
      setLoading(false);
      requestId.current += 1;
      return;
    }
    const currentId = ++requestId.current;
    setLoading(true);
    const result = await sha256(value);
    if (currentId === requestId.current) {
      setHash(result);
      setLoading(false);
    }
    // Se currentId for antigo, o resultado é descartado silenciosamente.
  };

  return (
    <ToolPanel>
      <label htmlFor="sha256-input" className="block text-sm font-medium mb-2">
        Texto a ser convertido em hash
      </label>
      <textarea
        id="sha256-input"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y"
      />

      {loading && (
        <div className="mt-3">
          <LoadingState label="Calculando hash..." />
        </div>
      )}

      {!loading && hash && (
        <div className="mt-4">
          <div className="text-sm font-medium mb-2">SHA-256</div>
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm font-mono break-all select-all">
            {hash}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-5">
        <CopyButton value={hash} />
        <ResetButton
          onClick={() => {
            setInput("");
            setHash("");
            requestId.current += 1;
          }}
        />
      </div>
    </ToolPanel>
  );
}
