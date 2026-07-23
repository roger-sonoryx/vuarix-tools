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

// Caracteres visualmente ambíguos (fáceis de confundir ao digitar/ler).
const AMBIGUOUS = "Il1O0o";

function secureShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  const randoms = new Uint32Array(result.length);
  crypto.getRandomValues(randoms);
  for (let i = result.length - 1; i > 0; i--) {
    const j = randoms[i] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function secureChar(pool: string): string {
  const rand = new Uint32Array(1);
  crypto.getRandomValues(rand);
  return pool[rand[0] % pool.length];
}

function generatePassword(
  length: number,
  options: Record<keyof typeof CHARSETS, boolean>,
  excludeAmbiguous: boolean
) {
  const activeKeys = (Object.keys(options) as (keyof typeof CHARSETS)[]).filter((k) => options[k]);
  if (activeKeys.length === 0) return "";

  const cleanSet = (s: string) =>
    excludeAmbiguous ? s.split("").filter((c) => !AMBIGUOUS.includes(c)).join("") : s;

  const pools = activeKeys.map((k) => cleanSet(CHARSETS[k])).filter(Boolean);
  const fullPool = pools.join("");
  if (!fullPool) return "";

  // Garante ao menos 1 caractere de cada grupo selecionado (se couber no tamanho).
  const guaranteed = pools.slice(0, length).map((pool) => secureChar(pool));
  const remainingLength = Math.max(length - guaranteed.length, 0);
  const rest = Array.from({ length: remainingLength }, () => secureChar(fullPool));

  return secureShuffle([...guaranteed, ...rest]).join("");
}

function estimateStrength(length: number, poolSize: number) {
  if (poolSize === 0 || length === 0) return { bits: 0, label: "Sem senha" };
  const bits = Math.round(length * Math.log2(poolSize));
  if (bits < 40) return { bits, label: "Fraca" };
  if (bits < 60) return { bits, label: "Razoável" };
  if (bits < 80) return { bits, label: "Forte" };
  return { bits, label: "Muito forte" };
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState(() =>
    generatePassword(16, { lower: true, upper: true, numbers: true, symbols: true }, false)
  );

  const regenerate = (
    newLength = length,
    newOptions = options,
    newExclude = excludeAmbiguous
  ) => {
    setPassword(generatePassword(newLength, newOptions, newExclude));
  };

  const toggle = (key: keyof typeof CHARSETS) => {
    const next = { ...options, [key]: !options[key] };
    const anySelected = Object.values(next).some(Boolean);
    if (!anySelected) return; // não permitir desmarcar tudo
    setOptions(next);
    regenerate(length, next, excludeAmbiguous);
  };

  const poolSize = (Object.keys(options) as (keyof typeof CHARSETS)[])
    .filter((k) => options[k])
    .reduce((acc, k) => {
      const set = excludeAmbiguous
        ? CHARSETS[k].split("").filter((c) => !AMBIGUOUS.includes(c)).join("")
        : CHARSETS[k];
      return acc + set.length;
    }, 0);

  const strength = estimateStrength(length, poolSize);
  const strengthColor =
    strength.label === "Fraca"
      ? "text-feedback-error"
      : strength.label === "Razoável"
      ? "text-feedback-warning"
      : "text-feedback-success";

  return (
    <ToolPanel>
      <div className="rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark px-4 py-3 font-mono text-base sm:text-lg break-all select-all">
        {password || "Selecione ao menos um tipo de caractere"}
      </div>

      {password && (
        <div className={`text-xs font-medium mt-2 ${strengthColor}`}>
          Força: {strength.label} (~{strength.bits} bits de entropia)
        </div>
      )}

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
            regenerate(v, options, excludeAmbiguous);
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

      <label className="flex items-center gap-2 mt-3 text-sm">
        <input
          type="checkbox"
          checked={excludeAmbiguous}
          onChange={(e) => {
            setExcludeAmbiguous(e.target.checked);
            regenerate(length, options, e.target.checked);
          }}
          className="accent-action"
        />
        Excluir caracteres ambíguos (I, l, 1, O, 0)
      </label>

      <div className="flex gap-2 mt-5">
        <button
          type="button"
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
