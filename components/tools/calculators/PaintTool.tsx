"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatNumber } from "../shared/format";

// Rendimento médio de tinta látex: ~10 m² por litro, com 2 demãos.
const YIELD_PER_LITER = 10;

export default function PaintTool() {
  const [area, setArea] = useState("40");
  const [coats, setCoats] = useState("2");

  const result = useMemo(() => {
    const a = parseFloat(area);
    const c = parseInt(coats, 10);
    if (!a || a <= 0 || !c || c <= 0) return null;
    const liters = (a * c) / YIELD_PER_LITER;
    const cans18L = Math.ceil(liters / 18);
    return { liters, cans18L };
  }, [area, coats]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-2 gap-4">
        <NumberField id="paint-area" label="Área a pintar" value={area} onChange={setArea} suffix="m²" />
        <NumberField id="paint-coats" label="Demãos" value={coats} onChange={setCoats} step="1" min={1} />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Tinta necessária", value: `${formatNumber(result.liters)} L`, highlight: true },
            { label: "Latas de 18L", value: `${result.cans18L}` },
          ]}
        />
      )}

      <p className="text-xs text-muted-light dark:text-muted-dark mt-3">
        Estimativa com rendimento médio de {YIELD_PER_LITER} m² por litro. Pode variar conforme a tinta e a superfície.
      </p>
    </ToolPanel>
  );
}
