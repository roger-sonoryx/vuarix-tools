"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";

type Scale = "c" | "f" | "k";

function toCelsius(value: number, scale: Scale) {
  if (scale === "c") return value;
  if (scale === "f") return ((value - 32) * 5) / 9;
  return value - 273.15;
}

function fromCelsius(celsius: number, scale: Scale) {
  if (scale === "c") return celsius;
  if (scale === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

const labels: Record<Scale, string> = { c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)" };

export default function TemperatureConverterTool() {
  const [value, setValue] = useState("25");
  const [from, setFrom] = useState<Scale>("c");
  const [to, setTo] = useState<Scale>("f");

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    if (from === "k" && v < 0) return { error: "Kelvin não pode ser negativo." } as const;
    const celsius = toCelsius(v, from);
    const converted = fromCelsius(celsius, to);
    if (to === "k" && converted < 0) return { error: "Resultado abaixo do zero absoluto." } as const;
    return { converted } as const;
  }, [value, from, to]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label htmlFor="temp-value" className="block text-sm font-medium mb-1.5">
            Valor
          </label>
          <div className="flex gap-2">
            <input
              id="temp-value"
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value as Scale)}
              aria-label="Escala de origem"
              className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
            >
              {(Object.keys(labels) as Scale[]).map((s) => (
                <option key={s} value={s}>
                  {labels[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            const oldFrom = from;
            setFrom(to);
            setTo(oldFrom);
          }}
          aria-label="Inverter escalas"
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition mb-0.5"
        >
          ⇄
        </button>

        <div>
          <label htmlFor="temp-result" className="block text-sm font-medium mb-1.5">
            Resultado
          </label>
          <div className="flex gap-2">
            <input
              id="temp-result"
              readOnly
              value={
  result && "converted" in result && typeof result.converted === "number"
    ? result.converted.toFixed(2)
    : ""
}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-action-soft px-4 py-2.5 text-sm font-mono outline-none"
            />
            <select
              value={to}
              onChange={(e) => setTo(e.target.value as Scale)}
              aria-label="Escala de destino"
              className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
            >
              {(Object.keys(labels) as Scale[]).map((s) => (
                <option key={s} value={s}>
                  {labels[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result && "error" in result && (
        <p className="text-sm text-feedback-error mt-3">{result.error}</p>
      )}
    </ToolPanel>
  );
}
