"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";
import LoadingState from "../shared/LoadingState";

export default function Md5Tool() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: string) => {
    setInput(value);
    if (!value) {
      setHash("");
      return;
    }
    setLoading(true);
    // Import dinâmico: crypto-js só entra no bundle quando esta ferramenta é aberta.
    const { default: CryptoJS } = await import("crypto-js");
    setHash(CryptoJS.MD5(value).toString());
    setLoading(false);
  };

  return (
    <ToolPanel>
      <label htmlFor="md5-input" className="block text-sm font-medium mb-2">
        Texto a ser convertido em hash
      </label>
      <textarea
        id="md5-input"
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
          <div className="text-sm font-medium mb-2">MD5</div>
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
          }}
        />
      </div>
    </ToolPanel>
  );
}
