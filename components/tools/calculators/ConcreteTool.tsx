"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatNumber } from "../shared/format";

// Traço comum 1:2:3 (cimento:areia:brita) em volume, por m³ de concreto.
export default function ConcreteTool() {
  const [length, setLength] = useState("4");
  const [width, setWidth] = useState("3");
  const [thickness, setThickness] = useState("0.10");

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const t = parseFloat(thickness);
    if (!l || !w || !t || l <= 0 || w <= 0 || t <= 0) return null;
    const volume = l * w * t;
    const cementBags = volume * 7; // ~7 sacos de 50kg por m³ no traço 1:2:3
    const sandM3 = volume * 0.5;
    const gravelM3 = volume * 0.7;
    return { volume, cementBags, sandM3, gravelM3 };
  }, [length, width, thickness]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NumberField id="conc-length" label="Comprimento" value={length} onChange={setLength} suffix="m" />
        <NumberField id="conc-width" label="Largura" value={width} onChange={setWidth} suffix="m" />
        <NumberField id="conc-thickness" label="Espessura" value={thickness} onChange={setThickness} suffix="m" />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Volume de concreto", value: `${formatNumber(result.volume, 3)} m³`, highlight: true },
            { label: "Cimento (sacos de 50kg)", value: `${Math.ceil(result.cementBags)}` },
            { label: "Areia", value: `${formatNumber(result.sandM3, 2)} m³` },
            { label: "Brita", value: `${formatNumber(result.gravelM3, 2)} m³` },
          ]}
        />
      )}

      <p className="text-xs text-muted-light dark:text-muted-dark mt-3">
        Estimativa com traço 1:2:3 (cimento:areia:brita). Consulte um engenheiro para obras estruturais.
      </p>
    </ToolPanel>
  );
}
