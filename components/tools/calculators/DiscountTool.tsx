"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatBRL } from "../shared/format";

export default function DiscountTool() {
  const [price, setPrice] = useState("199.90");
  const [discount, setDiscount] = useState("15");

  const result = useMemo(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (!p || p <= 0 || isNaN(d)) return null;
    const saved = p * (d / 100);
    return { saved, final: p - saved };
  }, [price, discount]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-2 gap-4">
        <NumberField id="disc-price" label="Preço original" value={price} onChange={setPrice} suffix="R$" />
        <NumberField id="disc-percent" label="Desconto" value={discount} onChange={setDiscount} suffix="%" />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Valor economizado", value: formatBRL(result.saved) },
            { label: "Preço final", value: formatBRL(result.final), highlight: true },
          ]}
        />
      )}
    </ToolPanel>
  );
}
