"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";
import { ErrorMessage } from "../shared/Messages";

type RGB = { r: number; g: number; b: number };
type HSL = { h: number; s: number; l: number };

function parseHex(input: string): RGB | null {
  const clean = input.trim().replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function parseRgb(input: string): RGB | null {
  const match = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return null;
  const [r, g, b] = [match[1], match[2], match[3]].map(Number);
  if ([r, g, b].some((v) => v < 0 || v > 255)) return null;
  return { r, g, b };
}

function parseHsl(input: string): HSL | null {
  const match = input.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
  if (!match) return null;
  const [h, s, l] = [match[1], match[2], match[3]].map(Number);
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return { h, s, l };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rN: h = (gN - bN) / d + (gN < bN ? 6 : 0); break;
      case gN: h = (bN - rN) / d + 2; break;
      case bN: h = (rN - gN) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHex({ r, g, b }: RGB) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

// Detecta o formato de entrada automaticamente e converte para RGB base.
function detectAndParse(input: string): { rgb: RGB; format: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^hsla?\(/i.test(trimmed)) {
    const hsl = parseHsl(trimmed);
    return hsl ? { rgb: hslToRgb(hsl), format: "HSL" } : null;
  }
  if (/^rgba?\(/i.test(trimmed)) {
    const rgb = parseRgb(trimmed);
    return rgb ? { rgb, format: "RGB" } : null;
  }
  const hex = parseHex(trimmed);
  return hex ? { rgb: hex, format: "HEX" } : null;
}

export default function ColorConverterTool() {
  const [input, setInput] = useState("#2F6FED");

  const parsed = useMemo(() => detectAndParse(input), [input]);

  const outputs = useMemo(() => {
    if (!parsed) return null;
    const { rgb } = parsed;
    const hsl = rgbToHsl(rgb);
    return {
      hex: rgbToHex(rgb),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      preview: rgbToHex(rgb),
    };
  }, [parsed]);

  return (
    <ToolPanel>
      <label htmlFor="color-input" className="block text-sm font-medium mb-2">
        Cor em HEX, RGB ou HSL
      </label>
      <div className="flex items-center gap-3">
        {outputs && (
          <div
            style={{ background: outputs.preview }}
            className="w-12 h-12 rounded-lg border border-border-light dark:border-border-dark shrink-0"
            aria-hidden
          />
        )}
        <input
          id="color-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#2F6FED, rgb(47, 111, 237) ou hsl(220, 87%, 56%)"
          className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-3 text-sm font-mono outline-none focus:border-action transition"
        />
      </div>

      {!outputs && input && (
        <div className="mt-4">
          <ErrorMessage>
            Não reconheci esse formato. Use HEX (#2F6FED), RGB (rgb(47, 111, 237)) ou HSL (hsl(220, 87%, 56%)).
          </ErrorMessage>
        </div>
      )}

      {outputs && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {[
            { label: "HEX", value: outputs.hex },
            { label: "RGB", value: outputs.rgb },
            { label: "HSL", value: outputs.hsl },
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
