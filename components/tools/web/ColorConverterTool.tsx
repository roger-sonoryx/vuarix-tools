"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import { ErrorMessage } from "../shared/Messages";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverterTool() {
  const [hex, setHex] = useState("#2F6FED");

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb]);

  const rgbText = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "";
  const hslText = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "";

  return (
    <ToolPanel>
      <label htmlFor="hex-input" className="block text-sm font-medium mb-2">
        Cor (HEX)
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={rgb ? hex : "#000000"}
          onChange={(e) => setHex(e.target.value)}
          className="w-12 h-12 rounded-lg border border-border-light dark:border-border-dark cursor-pointer"
          aria-label="Selecionar cor visualmente"
        />
        <input
          id="hex-input"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#2F6FED"
          className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 text-sm font-mono outline-none focus:border-action transition"
        />
      </div>

      {!rgb && hex && (
        <div className="mt-4">
          <ErrorMessage>Formato inválido. Use um HEX como #2F6FED ou #FFF.</ErrorMessage>
        </div>
      )}

      {rgb && hsl && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          {[
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
      )}
    </ToolPanel>
  );
}
