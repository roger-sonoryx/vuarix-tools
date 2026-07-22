"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatNumber } from "../shared/format";

export default function PercentageTool() {
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");

  const results = useMemo(() => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (isNaN(na) || isNaN(nb)) return null;
    return {
      percentOf: (na / 100) * nb, // quanto é X% de Y
      whatPercent: nb !== 0 ? (na / nb) * 100 : NaN, // X é quantos % de Y
      increase: nb * (1 + na / 100), // aumentar Y em X%
      decrease: nb * (1 - na / 100), // diminuir Y em X%
    };
  }, [a, b]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-2 gap-4">
        <NumberField id="pct-a" label="Percentual (%)" value={a} onChange={setA} suffix="%" />
        <NumberField id="pct-b" label="Valor" value={b} onChange={setB} />
      </div>

      {results && (
        <ResultBox
          items={[
            { label: `${a}% de ${b}`, value: formatNumber(results.percentOf), highlight: true },
            { label: `${a} é quantos % de ${b}`, value: `${formatNumber(results.whatPercent)}%` },
            { label: `${b} aumentado em ${a}%`, value: formatNumber(results.increase) },
            { label: `${b} reduzido em ${a}%`, value: formatNumber(results.decrease) },
          ]}
        />
      )}
    </ToolPanel>
  );
}
