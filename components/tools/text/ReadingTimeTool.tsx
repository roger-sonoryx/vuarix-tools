"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import ResetButton from "../shared/ResetButton";

const PRESETS = [160, 200, 240, 280];

export default function ReadingTimeTool() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(200);

  const { words, minutes, seconds } = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
    const totalSeconds = Math.round((words / wpm) * 60);
    return { words, minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 };
  }, [text, wpm]);

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

      <div className="mt-4">
        <label htmlFor="wpm-select" className="flex items-center justify-between text-sm font-medium mb-2">
          <span>Velocidade de leitura</span>
          <span className="font-mono">{wpm} palavras/min</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setWpm(p)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition ${
                wpm === p
                  ? "bg-action text-white border-action"
                  : "border-border-light dark:border-border-dark hover:opacity-70"
              }`}
            >
              {p}
            </button>
          ))}
          <input
            id="wpm-select"
            type="range"
            min={100}
            max={400}
            step={10}
            value={wpm}
            onChange={(e) => setWpm(Number(e.target.value))}
            className="w-full accent-action mt-2"
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-action-soft px-4 py-3 text-sm">
        <span className="font-mono font-semibold">
          {minutes > 0 ? `${minutes} min ` : ""}
          {seconds}s
        </span>{" "}
        <span className="text-muted-light dark:text-muted-dark">
          de leitura estimada · {words} palavras · base de {wpm} palavras/min
        </span>
      </div>

      <div className="mt-5">
        <ResetButton onClick={() => setText("")} />
      </div>
    </ToolPanel>
  );
}
