"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatNumber } from "../shared/format";

export default function FlooringTool() {
  const [length, setLength] = useState("5");
  const [width, setWidth] = useState("4");
  const [waste, setWaste] = useState("10");
  const [boxCoverage, setBoxCoverage] = useState("2");

  const result = useMemo(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const wa = parseFloat(waste) || 0;
    const box = parseFloat(boxCoverage);
    if (!l || !w || l <= 0 || w <= 0 || !box || box <= 0) return null;
    const area = l * w;
    const withWaste = area * (1 + wa / 100);
    const boxes = Math.ceil(withWaste / box);
    return { area, withWaste, boxes };
  }, [length, width, waste, boxCoverage]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-2 gap-4">
        <NumberField id="floor-length" label="Comprimento" value={length} onChange={setLength} suffix="m" />
        <NumberField id="floor-width" label="Largura" value={width} onChange={setWidth} suffix="m" />
        <NumberField id="floor-waste" label="Margem de perda" value={waste} onChange={setWaste} suffix="%" />
        <NumberField id="floor-box" label="Rendimento por caixa" value={boxCoverage} onChange={setBoxCoverage} suffix="m²" />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Área do ambiente", value: `${formatNumber(result.area)} m²` },
            { label: "Com margem de perda", value: `${formatNumber(result.withWaste)} m²` },
            { label: "Caixas necessárias", value: `${result.boxes}`, highlight: true },
          ]}
        />
      )}
    </ToolPanel>
  );
}
