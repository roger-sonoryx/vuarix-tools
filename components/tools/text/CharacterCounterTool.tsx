"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";

export default function CharacterCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const withSpaces = text.length;
    const withoutSpaces = text.replace(/\s/g, "").length;
    return { withSpaces, withoutSpaces };
  }, [text]);

  return (
    <ToolPanel>
      <label htmlFor="char-counter-input" className="block text-sm font-medium mb-2">
        Digite ou cole seu texto
      </label>
      <textarea
        id="char-counter-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Comece a digitar..."
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y"
      />

      <div className="flex flex-wrap gap-4 mt-4 text-sm">
        <div>
          <span className="font-mono font-semibold">{stats.withSpaces}</span>{" "}
          <span className="text-muted-light dark:text-muted-dark">caracteres (com espaços)</span>
        </div>
        <div>
          <span className="font-mono font-semibold">{stats.withoutSpaces}</span>{" "}
          <span className="text-muted-light dark:text-muted-dark">caracteres (sem espaços)</span>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <CopyButton value={text} />
        <ResetButton onClick={() => setText("")} />
      </div>
    </ToolPanel>
  );
}
