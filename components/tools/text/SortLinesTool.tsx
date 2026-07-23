"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";

export default function SortLinesTool() {
  const [text, setText] = useState("");
  const [reverse, setReverse] = useState(false);

  const sort = () => {
    const lines = text.split("\n");
    lines.sort((a, b) => a.localeCompare(b, "pt-BR"));
    if (reverse) lines.reverse();
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
          checked={reverse}
          onChange={(e) => setReverse(e.target.checked)}
          className="accent-action"
        />
        Ordem decrescente (Z → A)
      </label>

      <div className="flex flex-wrap gap-2 mt-4">
        <button type="button"
          onClick={sort}
          disabled={!text}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Ordenar linhas
        </button>
        <CopyButton value={text} />
        <ResetButton onClick={() => setText("")} />
      </div>
    </ToolPanel>
  );
}
