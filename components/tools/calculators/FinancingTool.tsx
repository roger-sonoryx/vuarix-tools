"use client";

import { useMemo, useState } from "react";
import ToolPanel from "../shared/ToolPanel";
import NumberField from "../shared/NumberField";
import ResultBox from "../shared/ResultBox";
import { formatBRL } from "../shared/format";

export default function FinancingTool() {
  const [amount, setAmount] = useState("30000");
  const [rate, setRate] = useState("1.5");
  const [months, setMonths] = useState("24");
  const [system, setSystem] = useState<"price" | "sac">("price");

  const result = useMemo(() => {
    const P = parseFloat(amount);
    const i = parseFloat(rate) / 100;
    const n = parseInt(months, 10);
    if (!P || !i || !n || P <= 0 || i <= 0 || n <= 0) return null;

    if (system === "price") {
      const installment = (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      const total = installment * n;
      return { first: installment, last: installment, total, interest: total - P };
    }
    // SAC: amortização constante, parcela decrescente
    const amortization = P / n;
    const firstInstallment = amortization + P * i;
    const lastInstallment = amortization + amortization * i;
    let balance = P;
    let total = 0;
    for (let k = 0; k < n; k++) {
      total += amortization + balance * i;
      balance -= amortization;
    }
    return { first: firstInstallment, last: lastInstallment, total, interest: total - P };
  }, [amount, rate, months, system]);

  return (
    <ToolPanel>
      <div className="flex gap-2 mb-4">
        {(["price", "sac"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSystem(s)}
            className={`text-sm font-medium px-3 py-2 rounded-lg border transition ${
              system === s
                ? "bg-action text-white border-action"
                : "border-border-light dark:border-border-dark hover:opacity-70"
            }`}
          >
            {s === "price" ? "Tabela Price" : "SAC"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NumberField id="fin-amount" label="Valor financiado" value={amount} onChange={setAmount} suffix="R$" />
        <NumberField id="fin-rate" label="Juros ao mês" value={rate} onChange={setRate} suffix="%" />
        <NumberField id="fin-months" label="Parcelas" value={months} onChange={setMonths} suffix="meses" />
      </div>

      {result && (
        <ResultBox
          items={[
            {
              label: system === "price" ? "Parcela fixa" : "1ª parcela",
              value: formatBRL(result.first),
              highlight: true,
            },
            ...(system === "sac" ? [{ label: "Última parcela", value: formatBRL(result.last) }] : []),
            { label: "Total pago", value: formatBRL(result.total) },
            { label: "Total de juros", value: formatBRL(result.interest) },
          ]}
        />
      )}
    </ToolPanel>
  );
}
