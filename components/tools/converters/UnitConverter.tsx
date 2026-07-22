"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";

export type Unit = { id: string; label: string; toBase: number }; // fator de conversão para a unidade base

// Componente genérico: recebe a lista de unidades e converte entre elas.
// Reaproveitado por Peso, Distância, Área, Volume, Velocidade e Arquivos.
// Temperatura tem fórmula própria (não é apenas multiplicação), então usa
// um componente à parte (TemperatureConverterTool).
export default function UnitConverter({ units, decimals = 6 }: { units: Unit[]; decimals?: number }) {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState(units[0].id);
  const [to, setTo] = useState(units[1]?.id ?? units[0].id);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const fromUnit = units.find((u) => u.id === from);
    const toUnit = units.find((u) => u.id === to);
    if (!fromUnit || !toUnit) return null;
    const inBase = v * fromUnit.toBase;
    return inBase / toUnit.toBase;
  }, [value, from, to, units]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label htmlFor="conv-value" className="block text-sm font-medium mb-1.5">
            Valor
          </label>
          <div className="flex gap-2">
            <input
              id="conv-value"
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-4 py-2.5 text-sm outline-none focus:border-action transition"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="Unidade de origem"
              className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
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
          aria-label="Inverter unidades"
          className="hidden sm:flex w-10 h-10 items-center justify-center rounded-lg border border-border-light dark:border-border-dark hover:opacity-70 transition mb-0.5"
        >
          ⇄
        </button>

        <div>
          <label htmlFor="conv-result" className="block text-sm font-medium mb-1.5">
            Resultado
          </label>
          <div className="flex gap-2">
            <input
              id="conv-result"
              readOnly
              value={result !== null ? result.toFixed(decimals).replace(/\.?0+$/, "") : ""}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-action-soft px-4 py-2.5 text-sm font-mono outline-none"
            />
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="Unidade de destino"
              className="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark px-3 py-2.5 text-sm outline-none focus:border-action transition"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ToolPanel>
  );
}
