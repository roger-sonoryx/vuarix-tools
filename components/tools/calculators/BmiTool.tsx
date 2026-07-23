"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatNumber } from "../shared/format";

function classify(bmi: number) {
  if (bmi < 18.5) return "Abaixo do peso";
  if (bmi < 25) return "Peso normal";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidade grau I";
  if (bmi < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}

export default function BmiTool() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("1.75");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return null;
    const bmi = w / (h * h);
    return { bmi, category: classify(bmi) };
  }, [weight, height]);

  return (
    <ToolPanel>
      <div className="grid grid-cols-2 gap-4">
        <NumberField id="bmi-weight" label="Peso" value={weight} onChange={setWeight} suffix="kg" />
        <NumberField id="bmi-height" label="Altura" value={height} onChange={setHeight} suffix="m" />
      </div>

      {result && (
        <ResultBox
          items={[
            { label: "Seu IMC", value: formatNumber(result.bmi), highlight: true },
            { label: "Classificação", value: result.category },
          ]}
        />
      )}

      <p className="text-xs text-muted-light dark:text-muted-dark mt-3">
        O IMC é uma referência geral e não substitui avaliação médica.
      </p>
    </ToolPanel>
  );
}
