"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatNumber } from "../shared/format";

// Regras práticas comuns em calculadoras de churrasco: ~400g de carne e
// ~1L de bebida por adulto; crianças contam como meia porção.
export default function BarbecueTool() {
  const [adults, setAdults] = useState("10");
  const [children, setChildren] = useState("2");

  const result = useMemo(() => {
    const a = parseInt(adults, 10) || 0;
    const c = parseInt(children, 10) || 0;
    if (a + c <= 0) return null;
    const equivalentAdults = a + c * 0.5;
    return {
      meatKg: (equivalentAdults * 400) / 1000,
      drinksL: equivalentAdults * 1,
      charcoalKg: equivalentAdults * 0.3,
      breadUnits: Math.ceil(equivalentAdults * 1.5),
    };
  }, [adults, children]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-2 gap-4">
        <NumberField id="bbq-adults" label="Adultos" value={adults} onChange={setAdults} min={0} step="1" />
        <NumberField id="bbq-children" label="Crianças" value={children} onChange={setChildren} min={0} step="1" />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Carne", value: `${formatNumber(result.meatKg)} kg`, highlight: true },
            { label: "Bebidas", value: `${formatNumber(result.drinksL)} L` },
            { label: "Carvão", value: `${formatNumber(result.charcoalKg)} kg` },
            { label: "Pão de alho / farofa (porções)", value: `${result.breadUnits}` },
          ]}
        />
      )}
    </ToolPanel>
  );
}
