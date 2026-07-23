"use client";

import { useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import CopyButton from "../shared/CopyButton";

const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_-+=<>?",
};

function generatePassword(length: number, options: Record<keyof typeof CHARSETS, boolean>) {
  const pool = (Object.keys(options) as (keyof typeof CHARSETS)[])
    .filter((k) => options[k])
    .map((k) => CHARSETS[k])
    .join("");

  if (!pool) return "";

  // Web Crypto API — aleatoriedade criptograficamente segura, gerada no navegador.
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => pool[v % pool.length]).join("");
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generatePassword(16, { lower: true, upper: true, numbers: true, symbols: true }));

  const regenerate = (newLength = length, newOptions = options) => {
    setPassword(generatePassword(newLength, newOptions));
  };

  const toggle = (key: keyof typeof CHARSETS) => {
    const next = { ...options, [key]: !options[key] };
    const anySelected = Object.values(next).some(Boolean);
    if (!anySelected) return; // não permitir desmarcar tudo
    setOptions(next);
    regenerate(length, next);
  };

  return (
    <ToolPanel>
      <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark px-4 py-3 font-mono text-base sm:text-lg break-all select-all">
        {password || "Selecione ao menos um tipo de caractere"}
      </div>

      <div className="mt-5">
        <label htmlFor="pw-length" className="flex items-center justify-between text-sm font-medium mb-2">
          <span>Comprimento</span>
          <span className="font-mono">{length}</span>
        </label>
        <input
          id="pw-length"
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => {
            const v = Number(e.target.value);
            setLength(v);
            regenerate(v, options);
          }}
          className="w-full accent-action"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {(
          [
            ["lower", "a-z"],
            ["upper", "A-Z"],
            ["numbers", "0-9"],
            ["symbols", "!@#$"],
          ] as [keyof typeof CHARSETS, string][]
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={() => toggle(key)}
              className="accent-action"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex gap-2 mt-5">
        <button type="button"
          onClick={() => regenerate()}
          className="text-white text-sm font-medium px-4 py-2 rounded-lg bg-action hover:opacity-90 transition"
        >
          Gerar nova senha
        </button>
        <CopyButton value={password} />
      </div>
    </ToolPanel>
  );
}
