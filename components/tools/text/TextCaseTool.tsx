"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import ResetButton from "../shared/ResetButton";

function toTitleCase(s: string) {
  // \p{L} (Unicode letter) trata corretamente palavras acentuadas (ex: "ação", "não").
  return s.replace(/\p{L}[\p{L}\d]*/gu, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function invertCase(s: string) {
  return s
    .split("")
    .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
    .join("");
}

const options = [
  { id: "upper", label: "MAIÚSCULAS", apply: (s: string) => s.toUpperCase() },
  { id: "lower", label: "minúsculas", apply: (s: string) => s.toLowerCase() },
  { id: "title", label: "Cada Palavra", apply: toTitleCase },
  {
    id: "sentence",
    label: "Frase.",
    apply: (s: string) =>
      s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  },
  { id: "invert", label: "iNVERTER cAIXA", apply: invertCase },
];

export default function TextCaseTool() {
  const [text, setText] = useState("");

  return (
    <ToolPanel>
      <label htmlFor="text-case-input" className="block text-sm font-medium mb-2">
        Digite ou cole seu texto
      </label>
      <textarea
        id="text-case-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Comece a digitar..."
        className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 text-sm outline-none focus:border-action transition resize-y"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => setText((t) => o.apply(t))}
            disabled={!text}
            className="text-sm font-medium px-3 py-2 rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-5">
        <CopyButton value={text} />
        <ResetButton onClick={() => setText("")} />
      </div>
    </ToolPanel>
  );
}
