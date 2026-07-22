"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";

const swatches = [
  "#2F6FED", "#0A2647", "#1E9E6B", "#F5A623", "#DC3545",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#64748B",
];

export default function ColorPickerTool() {
  const [color, setColor] = useState("#2F6FED");

  return (
    <ToolPanel>
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          aria-label="Selecionar cor"
          className="w-16 h-16 rounded-xl border border-border-light dark:border-border-dark cursor-pointer"
        />
        <div>
          <div className="font-mono text-lg font-semibold select-all">{color.toUpperCase()}</div>
          <div className="text-sm text-muted-light dark:text-muted-dark">Clique no quadrado para escolher</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-sm font-medium mb-2">Paleta rápida</div>
        <div className="flex flex-wrap gap-2">
          {swatches.map((s) => (
            <button type="button"
              key={s}
              onClick={() => setColor(s)}
              style={{ background: s }}
              aria-label={`Selecionar cor ${s}`}
              className="w-8 h-8 rounded-lg border border-border-light dark:border-border-dark hover:scale-110 transition-transform"
            />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <CopyButton value={color.toUpperCase()} label="Copiar HEX" />
      </div>
    </ToolPanel>
  );
}
