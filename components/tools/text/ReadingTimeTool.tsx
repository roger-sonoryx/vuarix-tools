"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import ResetButton from "../shared/ResetButton";

const WORDS_PER_MINUTE = 200;

export default function ReadingTimeTool() {
  const [text, setText] = useState("");

  const { words, minutes, seconds } = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
    const totalSeconds = Math.round((words / WORDS_PER_MINUTE) * 60);
    return { words, minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 };
  }, [text]);

  return (
    <ToolPanel>
      <label htmlFor="reading-time-input" className="block text-sm font-medium mb-2">
        Cole o texto que deseja analisar
      </label>
      <textarea
        id="reading-time-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Cole seu artigo, post ou texto aqui..."
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y"
      />

      <div className="mt-4 rounded-xl bg-action-soft px-4 py-3 text-sm">
        <span className="font-mono font-semibold">
          {minutes > 0 ? `${minutes} min ` : ""}
          {seconds}s
        </span>{" "}
        <span className="text-muted-light dark:text-muted-dark">
          de leitura estimada · {words} palavras · base de {WORDS_PER_MINUTE} palavras/min
        </span>
      </div>

      <div className="mt-5">
        <ResetButton onClick={() => setText("")} />
      </div>
    </ToolPanel>
  );
}
