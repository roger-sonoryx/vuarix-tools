"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import ResetButton from "../shared/ResetButton";
import { ErrorMessage, SuccessMessage } from "../shared/Messages";

export default function JsonValidatorTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null);

  const validate = () => {
    try {
      JSON.parse(input);
      setResult({ valid: true, message: "JSON válido." });
    } catch (e) {
      let message = e instanceof Error ? e.message : "JSON inválido.";
      // Motores V8/JSC costumam incluir "position N" na mensagem nativa de erro.
      const match = message.match(/position (\d+)/i);
      if (match) {
        const pos = parseInt(match[1], 10);
        const before = input.slice(0, pos);
        const line = before.split("\n").length;
        const col = pos - before.lastIndexOf("\n");
        message += ` (linha ${line}, coluna ${col})`;
      }
      setResult({ valid: false, message });
    }
  };

  return (
    <ToolPanel>
      <label htmlFor="json-validator-input" className="block text-sm font-medium mb-2">
        Cole o JSON que deseja validar
      </label>
      <textarea
        id="json-validator-input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setResult(null);
        }}
        rows={8}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y font-mono"
      />

      {result && (
        <div className="mt-4">
          {result.valid ? (
            <SuccessMessage>{result.message}</SuccessMessage>
          ) : (
            <ErrorMessage>{result.message}</ErrorMessage>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-5">
        <button
          type="button"
          onClick={validate}
          disabled={!input}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Validar JSON
        </button>
        <ResetButton
          onClick={() => {
            setInput("");
            setResult(null);
          }}
        />
      </div>
    </ToolPanel>
  );
}
