"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";
import { SuccessMessage } from "../shared/Messages";

export default function RemoveDuplicatesTool() {
  const [text, setText] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [removedCount, setRemovedCount] = useState<number | null>(null);

  const dedupe = () => {
    let lines = text.split("\n");
    if (removeEmpty) lines = lines.filter((l) => l.trim() !== "");

    const seen = new Set<string>();
    const unique = lines.filter((line) => {
      const key = ignoreCase ? line.trim().toLowerCase() : line.trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setRemovedCount(lines.length - unique.length);
    setText(unique.join("\n"));
  };

  return (
    <ToolPanel>
      <label htmlFor="dedupe-input" className="block text-sm font-medium mb-2">
        Cole uma linha por item
      </label>
      <textarea
        id="dedupe-input"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setRemovedCount(null);
        }}
        rows={8}
        placeholder={"maçã\nbanana\nMaçã"}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y font-mono"
      />

      <div className="flex flex-col gap-2 mt-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="accent-action"
          />
          Ignorar maiúsculas/minúsculas ("Maçã" = "maçã")
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={removeEmpty}
            onChange={(e) => setRemoveEmpty(e.target.checked)}
            className="accent-action"
          />
          Remover linhas vazias
        </label>
      </div>

      {removedCount !== null && (
        <div className="mt-3">
          <SuccessMessage>
            {removedCount === 0
              ? "Nenhuma linha duplicada encontrada."
              : `${removedCount} linha(s) duplicada(s) removida(s).`}
          </SuccessMessage>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          type="button"
          onClick={dedupe}
          disabled={!text}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Remover duplicados
        </button>
        <CopyButton value={text} />
        <ResetButton
          onClick={() => {
            setText("");
            setRemovedCount(null);
          }}
        />
      </div>
    </ToolPanel>
  );
}
