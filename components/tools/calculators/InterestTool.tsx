"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatBRL } from "../shared/format";

export default function InterestTool() {
  const [principal, setPrincipal] = useState("1000");
  const [rate, setRate] = useState("2");
  const [periods, setPeriods] = useState("12");

  const result = useMemo(() => {
    const P = parseFloat(principal);
    const i = parseFloat(rate) / 100;
    const n = parseFloat(periods);
    if (!P || P <= 0 || !i || i < 0 || !n || n < 0) return null;

    const simple = P * (1 + i * n);
    const compound = P * Math.pow(1 + i, n);
    return {
      simple,
      simpleInterest: simple - P,
      compound,
      compoundInterest: compound - P,
    };
  }, [principal, rate, periods]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NumberField id="int-principal" label="Valor inicial" value={principal} onChange={setPrincipal} suffix="R$" />
        <NumberField id="int-rate" label="Taxa por período" value={rate} onChange={setRate} suffix="%" />
        <NumberField id="int-periods" label="Períodos" value={periods} onChange={setPeriods} />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Montante (juros simples)", value: formatBRL(result.simple) },
            { label: "Juros simples", value: formatBRL(result.simpleInterest) },
            { label: "Montante (juros compostos)", value: formatBRL(result.compound), highlight: true },
            { label: "Juros compostos", value: formatBRL(result.compoundInterest) },
          ]}
        />
      )}
    </ToolPanel>
  );
}
