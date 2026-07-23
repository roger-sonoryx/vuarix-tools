"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";

const swatches = [
  "#2F6FED", "#0A2647", "#1E9E6B", "#F5A623", "#DC3545",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#64748B",
];

function hexToRgb(hex: string) {
  const num = parseInt(hex.replace("#", ""), 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorPickerTool() {
  const [color, setColor] = useState("#2F6FED");

  const { rgbText, hslText } = useMemo(() => {
    const { r, g, b } = hexToRgb(color);
    const hsl = rgbToHsl(r, g, b);
    return {
      rgbText: `rgb(${r}, ${g}, ${b})`,
      hslText: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  }, [color]);

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
            <button
              key={s}
              type="button"
              onClick={() => setColor(s)}
              style={{ background: s }}
              aria-label={`Selecionar cor ${s}`}
              className="w-8 h-8 rounded-lg border border-border-light dark:border-border-dark hover:scale-110 transition-transform"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        {[
          { label: "HEX", value: color.toUpperCase() },
          { label: "RGB", value: rgbText },
          { label: "HSL", value: hslText },
        ].map((f) => (
          <div key={f.label} className="rounded-xl border border-border-light dark:border-border-dark p-4">
            <div className="text-xs text-muted-light dark:text-muted-dark mb-1">{f.label}</div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm">{f.value}</span>
              <CopyButton value={f.value} label="" />
            </div>
          </div>
        ))}
      </div>
    </ToolPanel>
  );
}
