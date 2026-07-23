"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatBRL } from "../shared/format";

export default function SplitBillTool() {
  const [total, setTotal] = useState("240");
  const [people, setPeople] = useState("4");
  const [tip, setTip] = useState("10");

  const result = useMemo(() => {
    const t = parseFloat(total);
    const p = parseInt(people, 10);
    const tp = parseFloat(tip) || 0;
    if (!t || t <= 0 || !p || p <= 0) return null;
    const withTip = t * (1 + tp / 100);
    return { withTip, perPerson: withTip / p };
  }, [total, people, tip]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NumberField id="split-total" label="Valor da conta" value={total} onChange={setTotal} suffix="R$" />
        <NumberField id="split-people" label="Pessoas" value={people} onChange={setPeople} min={1} step="1" />
        <NumberField id="split-tip" label="Gorjeta" value={tip} onChange={setTip} suffix="%" />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Total com gorjeta", value: formatBRL(result.withTip) },
            { label: "Valor por pessoa", value: formatBRL(result.perPerson), highlight: true },
          ]}
        />
      )}
    </ToolPanel>
  );
}
