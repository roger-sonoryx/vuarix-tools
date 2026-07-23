"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";

export default function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
    const sentences = trimmed.length === 0 ? 0 : (trimmed.match(/[.!?]+/g) || []).length;
    const paragraphs = trimmed.length === 0 ? 0 : trimmed.split(/\n+/).filter(Boolean).length;
    return { words, sentences, paragraphs };
  }, [text]);

  return (
    <ToolPanel>
      <label htmlFor="word-counter-input" className="block text-sm font-medium mb-2">
        Digite ou cole seu texto
      </label>
      <textarea
        id="word-counter-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Comece a digitar..."
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y"
      />

      <div className="flex flex-wrap gap-4 mt-4 text-sm">
        <div>
          <span className="font-mono font-semibold">{stats.words}</span>{" "}
          <span className="text-muted-light dark:text-muted-dark">palavras</span>
        </div>
        <div>
          <span className="font-mono font-semibold">{stats.sentences}</span>{" "}
          <span className="text-muted-light dark:text-muted-dark">frases</span>
        </div>
        <div>
          <span className="font-mono font-semibold">{stats.paragraphs}</span>{" "}
          <span className="text-muted-light dark:text-muted-dark">parágrafos</span>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <CopyButton value={text} />
        <ResetButton onClick={() => setText("")} />
      </div>
    </ToolPanel>
  );
}
