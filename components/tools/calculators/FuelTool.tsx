"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";

export default function FuelTool() {
  const [ethanol, setEthanol] = useState("3.99");
  const [gasoline, setGasoline] = useState("5.79");

  const result = useMemo(() => {
    const e = parseFloat(ethanol);
    const g = parseFloat(gasoline);
    if (!e || !g || e <= 0 || g <= 0) return null;
    const ratio = (e / g) * 100;
    const best = ratio < 70 ? "Álcool" : "Gasolina";
    return { ratio, best };
  }, [ethanol, gasoline]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-2 gap-4">
        <NumberField id="fuel-ethanol" label="Preço do álcool" value={ethanol} onChange={setEthanol} suffix="R$/L" />
        <NumberField id="fuel-gasoline" label="Preço da gasolina" value={gasoline} onChange={setGasoline} suffix="R$/L" />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Álcool ÷ Gasolina", value: `${result.ratio.toFixed(1)}%` },
            {
              label: "Mais vantajoso",
              value: `${result.best} (regra: abaixo de 70% compensa álcool)`,
              highlight: true,
            },
          ]}
        />
      )}
    </ToolPanel>
  );
}
