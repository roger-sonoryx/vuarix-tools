"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";

type SortMode = "alpha" | "alpha-desc" | "numeric" | "numeric-desc";

export default function SortLinesTool() {
  const [text, setText] = useState("");
  const [removeEmpty, setRemoveEmpty] = useState(false);

  const sort = (mode: SortMode) => {
    let lines = text.split("\n");
    if (removeEmpty) lines = lines.filter((l) => l.trim() !== "");

    if (mode === "alpha" || mode === "alpha-desc") {
      lines.sort((a, b) => a.localeCompare(b, "pt-BR"));
      if (mode === "alpha-desc") lines.reverse();
    } else {
      lines.sort((a, b) => {
        const na = parseFloat(a.replace(",", "."));
        const nb = parseFloat(b.replace(",", "."));
        const va = isNaN(na) ? Infinity : na;
        const vb = isNaN(nb) ? Infinity : nb;
        return va - vb;
      });
      if (mode === "numeric-desc") lines.reverse();
    }
    setText(lines.join("\n"));
  };

  return (
    <ToolPanel>
      <label htmlFor="sort-lines-input" className="block text-sm font-medium mb-2">
        Cole uma linha por item
      </label>
      <textarea
        id="sort-lines-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={"banana\nabacaxi\nmaçã"}
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y font-mono"
      />

      <label className="flex items-center gap-2 mt-3 text-sm">
        <input
          type="checkbox"
          checked={removeEmpty}
          onChange={(e) => setRemoveEmpty(e.target.checked)}
          className="accent-action"
        />
        Remover linhas vazias ao ordenar
      </label>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          type="button"
          onClick={() => sort("alpha")}
          disabled={!text}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          A → Z
        </button>
        <button
          type="button"
          onClick={() => sort("alpha-desc")}
          disabled={!text}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Z → A
        </button>
        <button
          type="button"
          onClick={() => sort("numeric")}
          disabled={!text}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Numérica crescente
        </button>
        <button
          type="button"
          onClick={() => sort("numeric-desc")}
          disabled={!text}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Numérica decrescente
        </button>
        <CopyButton value={text} />
        <ResetButton onClick={() => setText("")} />
      </div>
    </ToolPanel>
  );
}
